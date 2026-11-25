// Conexión con GitHub: reúne la evidencia del repositorio
import { parseRepo } from "./utils.js";

const API = "https://api.github.com";
const CODE = /\.(py|js|ts|jsx|tsx|ino|cpp|c|java|ipynb|html|css)$/i;
const KEY = /(^|\/)(readme|requirements\.txt|package\.json|main\.|app\.|model|train|predict|sensor)/i;

async function gh(path) {
  const r = await fetch(API + path, { headers: { Accept: "application/vnd.github+json" } });
  if (!r.ok) {
    throw new Error(
      r.status === 403
        ? "GitHub limitó las peticiones. Espera unos minutos."
        : `GitHub respondió ${r.status}. ¿El repositorio es público?`
    );
  }
  return r.json();
}

// Devuelve un texto con toda la información útil del repositorio
export async function collectRepo(url) {
  const { owner, repo } = parseRepo(url);
  const meta = await gh(`/repos/${owner}/${repo}`);

  const [langs, commits, tree] = await Promise.all([
    gh(`/repos/${owner}/${repo}/languages`),
    gh(`/repos/${owner}/${repo}/commits?per_page=30`).catch(() => []),
    gh(`/repos/${owner}/${repo}/git/trees/${meta.default_branch}?recursive=1`).catch(() => ({ tree: [] })),
  ]);

  const files = tree.tree.filter((f) => f.type === "blob");
  const picks = files
    .filter((f) => KEY.test(f.path) || CODE.test(f.path))
    .sort((a, b) => KEY.test(b.path) - KEY.test(a.path))
    .slice(0, 8);

  const contents = await Promise.all(
    picks.map(async (f) => {
      const r = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${meta.default_branch}/${f.path}`
      );
      return `--- ${f.path} ---\n${r.ok ? (await r.text()).slice(0, 4000) : ""}`;
    })
  );

  return `REPO: ${meta.full_name}
Descripción: ${meta.description || "(sin descripción)"}
Estrellas: ${meta.stargazers_count} | Forks: ${meta.forks_count} | Issues: ${meta.open_issues_count}
Licencia: ${meta.license?.spdx_id || "ninguna"} | Último push: ${meta.pushed_at}
Lenguajes: ${JSON.stringify(langs)}
Commits recientes: ${commits.length}
Mensajes: ${commits.slice(0, 10).map((c) => c.commit.message.split("\n")[0]).join(" | ")}
Archivos (${files.length}):
${files.slice(0, 120).map((f) => f.path).join("\n")}

CONTENIDO CLAVE:
${contents.join("\n\n")}`;
}
