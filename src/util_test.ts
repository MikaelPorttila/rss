import { assert } from "../test_deps.ts";
import { isValidHttpURL } from "./util.ts";

Deno.test("is valid HTTP URL", () => {
  assert(
    isValidHttpURL(
      "https://shopify.engineering/shipit-writing-react-native-apps",
    ),
  );
  assert(
    isValidHttpURL(
      "http://shopify.engineering/shipit-writing-react-native-apps",
    ),
  );
  assert(!isValidHttpURL("test.com/test"));
  assert(!isValidHttpURL("test/data/test"));
});
