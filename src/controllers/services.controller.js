export const showServices = async (req, res) => {
  await res.render("services", {
    title: "Services",
    haveAdditionalCss: true,
  });
};
