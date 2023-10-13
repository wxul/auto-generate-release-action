import * as core from "@actions/core";
import * as github from "@actions/github";
import { assert, escapeBreakLine, parseReleaseNote } from "./utils";

async function run() {
  // const GITHUB_TOKEN = process.env["GITHUB_TOKEN"];
  const GITHUB_TOKEN = "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";
  assert(GITHUB_TOKEN, "Environment GITHUB_TOKEN is required");

  // const sourceTag = core.getInput("source_tag", { required: true });
  const sourceTag = "v4.1.0-2023.10.13.12.19.25";
  const escapeBreak = core.getInput("escape_break");

  // const { owner, repo } = github.context.repo;
  const { owner, repo } = { owner: "surreal-ai", repo: "pacific" };
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
  console.log(parsedNotes);

  core.setOutput("release_note", parsedNotes);
}

run().catch((error) => {
  core.setFailed(error.message);
  console.error("error", error.message);
});
