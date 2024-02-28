import * as core from "@actions/core";
import * as github from "@actions/github";
import { assert, escapeBreakLine, parseReleaseNote } from "./utils";

async function run() {
  const GITHUB_TOKEN = process.env["GITHUB_TOKEN"];
  assert(GITHUB_TOKEN, "Environment GITHUB_TOKEN is required");

  const sourceTag = core.getInput("source_tag", { required: true });
  const escapeBreak = core.getInput("escape_break");
  const prefix = core.getInput("prefix");

  let prevTag = "";

  const { owner, repo } = github.context.repo;
  const client = github.getOctokit(GITHUB_TOKEN);

  if (prefix) {
    try {
      const releases = await client.rest.repos.listReleases({
        owner,
        repo,
        per_page: 50,
      });
      const findRelease = releases.data
        .sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at))
        .find((rl) => rl.tag_name.startsWith(prefix));
      if (findRelease) {
        prevTag = findRelease.tag_name;
      }
    } catch (error) {}
  }

  const response = await client.rest.repos.generateReleaseNotes({
    owner,
    repo,
    tag_name: sourceTag,
    previous_tag_name: prevTag ? prevTag : void 0,
  });
  const notes = response.data.body;
  let parsedNotes = parseReleaseNote(notes, { owner, repo });

  if (escapeBreak) {
    parsedNotes = escapeBreakLine(parsedNotes, escapeBreak);
  }
  console.log(parsedNotes);

  core.setOutput("release_note", parsedNotes);
}

run().catch((error) => {
  core.setFailed(error.message);
  console.error("error", error.message);
});
