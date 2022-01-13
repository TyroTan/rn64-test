import { LogBox } from "react-native";

const ignoredWarnings: string[] = ["Expected style"];

function isWarnIgnored(...args: any[]) {
  return args.some((arg) => {
    if (typeof arg !== "string") {
      return false;
    }

    return ignoredWarnings.some((ignoredWarning) => {
      return arg.includes(ignoredWarning);
    });
  });
}

function overwriteConsoleLog() {
  const isObject = (obj: any) =>
    obj === null || (obj && obj.toString() === "[object Object]");
  const consoleLogCopy = console.log;
  console.log = (...props) => {
    return [...props].map((log) =>
      isObject(log)
        ? consoleLogCopy(JSON.stringify(log, null, 4))
        : consoleLogCopy(log)
    );
  };
}

if (__DEV__) {
  overwriteConsoleLog();

  const _warn = console.warn;
  console.warn = function (...args: any[]) {
    if (isWarnIgnored(...args)) {
      return;
    }
    _warn(...args);
  };

  // YellowBox.ignoreWarnings(ignoredWarnings);
  LogBox.ignoreLogs(["Warning: ...", "inline style"]);

  // comment this out in android when yellow boxes aren't necessary
  // console.disableYellowBox = true;
}
