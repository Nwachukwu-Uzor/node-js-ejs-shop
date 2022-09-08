export const get404 = (req, res) => {
  res.render("404", {
    title: "Not Found 😥",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};
export const get500 = (req, res) => {
  res.render("500", {
    title: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
