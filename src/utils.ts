export function assert(val: any, message: string) {
  if (!val) {
    throw new Error(message);
  }
}

export function parseReleaseNote(
  note: string,
  options: { owner: string; repo: string }
) {
  const { owner, repo } = options;
  const regPR = new RegExp(
    `https://github.com/${owner}/${repo}/pull/(\\d+)`,
    "ig"
  );
  const regCompare = new RegExp(
    `https://github.com/${owner}/${repo}/compare/(\\S+)`,
    "ig"
  );
  return note
    .replace(regPR, (source, $1) => {
      return `[#${$1}](${source})`;
    })
    .replace(regCompare, (source, $1) => {
      return `[#${$1}](${source})`;
    });
}
