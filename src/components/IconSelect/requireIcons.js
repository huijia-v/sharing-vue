let icons = []
const modules = import.meta.glob('./../../assets/image/icons/svg/*.svg');
for (const path in modules) {
  const p = path.split('assets/image/icons/svg/')[1].split('.svg')[0];
  icons.push(p);
}

export default icons
