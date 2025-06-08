const { ipcRenderer } = require('electron');

function formatSize(bytes) {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  if (bytes >= GB) return `${(bytes / GB).toFixed(1)} GB`;
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${(bytes / KB).toFixed(1)} KB`;
}

function getIcon(name, isDir) {
  if (isDir) return '📁';
  const ext = name.split('.').pop().toLowerCase();
  const icons = {
    tmp: '🗑️',
    log: '📜',
    bak: '📦',
    zip: '🗜️',
    txt: '📄',
  };
  return icons[ext] || '📄';
}

function getExtClass(name) {
  const ext = name.split('.').pop().toLowerCase();
  const exts = ['tmp', 'log', 'bak', 'zip', 'txt'];
  return exts.includes(ext) ? `ext-${ext}` : '';
}

function createTree(nodes) {
  const ul = document.createElement('ul');
  for (const node of nodes) {
    const li = document.createElement('li');
    li.classList.add('tree-item');

    const row = document.createElement('div');
    const extClass = getExtClass(node.name);
    row.classList.add('tree-row');
    if (extClass) row.classList.add(extClass);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.path = node.path;
    checkbox.addEventListener('change', () => {
      li.classList.toggle('selected', checkbox.checked);
    });
    row.appendChild(checkbox);

    let label = null;
    let childUl = null;

    if (node.isDirectory && node.children) {
      const toggle = document.createElement('span');
      toggle.textContent = '▶️';
      toggle.classList.add('toggle');
      row.appendChild(toggle);

      label = document.createElement('span');
      label.classList.add('label', 'collapsible');
      label.textContent = `${getIcon(node.name, node.isDirectory)} ${node.name} (${formatSize(node.size)})`;
      row.appendChild(label);

      childUl = createTree(node.children);
      childUl.classList.add('nested', 'collapsed');

      const toggleChildren = () => {
        const collapsed = childUl.classList.toggle('collapsed');
        toggle.textContent = collapsed ? '▶️' : '🔽';
      };

      toggle.addEventListener('click', toggleChildren);
      label.addEventListener('click', toggleChildren);

      li.appendChild(row);
      li.appendChild(childUl);
    } else {
      label = document.createElement('span');
      label.classList.add('label');
      label.textContent = `${getIcon(node.name, node.isDirectory)} ${node.name} (${formatSize(node.size)})`;
      row.appendChild(label);
      li.appendChild(row);
    }

    ul.appendChild(li);
  }
  return ul;
}

document.addEventListener('DOMContentLoaded', async () => {
  const treeData = await ipcRenderer.invoke('scan');
  const container = document.getElementById('file-list');
  if (container) {
    container.appendChild(createTree(treeData));
  }

  document.getElementById('delete').addEventListener('click', async () => {
    const checked = Array.from(
      document.querySelectorAll('input[type=checkbox]'),
    ).filter((c) => c.checked);
    const paths = checked.map((c) => c.dataset.path);
    if (paths.length === 0) return;
    await ipcRenderer.invoke('delete', paths);
    window.location.reload();
  });
});
