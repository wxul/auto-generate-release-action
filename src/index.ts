import * as core from "@actions/core";
import * as github from "@actions/github";
import { assert, escapeBreakLine, parseReleaseNote } from "./utils";

async function run() {
  const GITHUB_TOKEN = process.env["GITHUB_TOKEN"];
  assert(GITHUB_TOKEN, "Environment GITHUB_TOKEN is required");

  const sourceTag = core.getInput("source_tag", { required: true });
  const escapeBreak = core.getInput("escape_break") || "\\n";

  const { owner, repo } = github.context.repo;
  const client = github.getOctokit(GITHUB_TOKEN);

  const response = await client.rest.repos.generateReleaseNotes({
    owner,
    repo,
    tag_name: sourceTag,
  });
  const notes = response.data.body;
  let parsedNotes = parseReleaseNote(notes, { owner, repo });

  if (escapeBreak) {
    parsedNotes = escapeBreakLine(parsedNotes, escapeBreak);
  }
  console.log("response", notes, parsedNotes);

  core.setOutput("release_note", parsedNotes);
}

run().catch((error) => {
  core.setFailed(error.message);
  console.error("error", error.message);
});
