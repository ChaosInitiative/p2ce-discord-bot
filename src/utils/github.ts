import { Octokit } from 'octokit';
import { GitHubIssue } from '../types/github';

import * as config from '../config.json';

// Octokit instance for GitHub api stuff
const octokit = new Octokit({ auth: config.github_token });

// This can and should be lost when the bot restarts
const ISSUE_CACHE = new Map<string, { issues: Array<GitHubIssue>, time: number }>();

export async function getIssuesInRepo(repo: string) {
	if (ISSUE_CACHE.has(repo) && (ISSUE_CACHE.get(repo)?.time ?? 0) > Date.now()) {
		return ISSUE_CACHE.get(repo)?.issues ?? [];
	}

	const repoInfo = (config.git_repos as {[repo: string]: {owner: string, name: string}})[repo];
	const issues: Array<GitHubIssue> = [];
	let empty = false;
	let page = 1;
	while (!empty) {
		const issuesRaw = await octokit.rest.issues.listForRepo({
			owner: repoInfo.owner,
			repo: repoInfo.name,
			page: page++,
			per_page: 50,
			state: 'all',
		});
		for (const issue of issuesRaw.data) {
			issues.push(issue as GitHubIssue);
		}
		empty = (issuesRaw.data.length === 0);

		ISSUE_CACHE.set(repo, { issues: issues, time: Date.now() + (config.options.github.search_page_cache_time * 1000 * 60) });
	}
	return issues;
}

export async function getIssueInRepo(repo: string, issueID: number): Promise<GitHubIssue | undefined> {
	const issues = await getIssuesInRepo(repo).then(issues => issues.filter(issue => issue.number === issueID));
	if (issues.length > 0) {
		return issues[0];
	}
	return undefined;
}

export async function searchIssuesInRepo(repo: string, query: string, open: boolean | null | undefined = undefined) {
	return getIssuesInRepo(repo).then(issues => issues.filter(issue => {
		const inTitle = issue.title.toLowerCase().includes(query.toLowerCase());
		const inBody = issue.body && issue.body.toLowerCase().includes(query.toLowerCase());
		return (inTitle || inBody) && (!open || issue.state === 'open');
	}));
}
