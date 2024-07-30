export const contact = async (req, res) => {
  await res.render("contact", { title: "Contact", haveAdditionalCss: true });
};
