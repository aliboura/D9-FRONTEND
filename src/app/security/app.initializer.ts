import {LoginService} from "./login.service";

export function appInitializer(loginService: LoginService) {
  return () => new Promise(resolve => {
    loginService.onRefresh()
      .subscribe()
      .add(resolve);
  });
}
