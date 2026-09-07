# Forward Declarations

Track all forward declarations that need to be replaced with real imports.
Check this file before starting any migration step.

| Declaration | Location | Resolves at | Notes |
|---|---|---|---|
| `type Mp4Parser = unknown` | `ts/lib/types/mp4_parser.ts` | Step 2.7 | Replace with import from util |
| `type DataViewReader = unknown` | `ts/lib/types/mp4_parser.ts` | Step 2.6 | Replace with import from util |
| `type Severity = number` | `ts/lib/types/error.ts` | Step 2.4 | Replace with real enum type |
| `type Category = number` | `ts/lib/types/error.ts` | Step 2.4 | Replace with real enum type |
| `type Code = number` | `ts/lib/types/error.ts` | Step 2.4 | Replace with real enum type |
