---
"valkeyrie": minor
---

Let a driver declare the key format of its rows with `keyFormat` on the `Driver`. Valkeyrie then opens and clears a store without a commit and writes no key format row, so a store that is opened and never written to stays empty. It still refuses a store whose key format row, or whose driver, has another key format. The MongoDB driver takes a `keyFormat` option for this.
