export const about = async (req, res) => {
  await res.render("about", { title: "About", haveAdditionalCss: true });
};
