export const routeIndicator = (routeIndex) => {
  let routeIndicator = "";
  const routes = JSON.parse(localStorage.getItem("routeData"));
  if (routes[routeIndex]) {
    if (
      routes[routeIndex].id.slice(-1) == routes[routeIndex + 1]?.id.slice(-1)
    ) {
      routeIndicator = `${routes[routeIndex].id.slice(0, -1)}⟳`;
    } else {
      if (routes[routeIndex].id.slice(-1) == "A") {
        routeIndicator = `${routes[routeIndex].id.slice(0, -1)}►`;
      } else if (routes[routeIndex].id.slice(-1) == "B") {
        routeIndicator = `${routes[routeIndex].id.slice(0, -1)}◄`;
      }
    }
  }
  return routeIndicator;
};
