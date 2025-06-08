const { ipcRenderer } = require("electron");

function createTree(nodes) {
  const ul = document.createElement("ul");
  for (const node of nodes) {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.path = node.path;
    li.appendChild(checkbox);
    const label = document.createElement("span");
    label.textContent = `${node.name} (${(node.size / 1024).toFixed(1)} KB)`;
    li.appendChild(label);
    if (node.isDirectory && node.children) {
      li.appendChild(createTree(node.children));
    }
    ul.appendChild(li);
  }
  return ul;
}

ipcRenderer.invoke("scan").then((data) => {
  const container = document.getElementById("tree");
  container.appendChild(createTree(data));
});

document.getElementById("delete").addEventListener("click", async () => {
  const checked = Array.from(
    document.querySelectorAll("input[type=checkbox]"),
  ).filter((c) => c.checked);
  const paths = checked.map((c) => c.dataset.path);
  if (paths.length === 0) return;
  await ipcRenderer.invoke("delete", paths);
  window.location.reload();
});
