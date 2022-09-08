export const get404 = (req, res) => {
  res.render("404", {
    title: "Not Found 😥",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};
