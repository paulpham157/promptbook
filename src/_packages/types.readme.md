This package is useful when you want to explicitly define types in your code.

```typescript
import type { PipelineJson } from '@promptbook/types';
import { compilePipeline } from '@promptbook/core';

const promptbook: PipelineJson = compilePipeline(
    spaceTrim(`

        # ✨ Example prompt

        -   OUTPUT PARAMETER {greeting}


        ## 💬 Prompt

        \`\`\`text
        Hello
        \`\`\`

        -> {greeting}

    `),
);
```

_Note: `@promptbook/types` does not export brand-specific types like `OpenAiExecutionToolsOptions`, `ClaudeExecutionToolsOptions`, `LangchainExecutionToolsOptions`,... etc._
