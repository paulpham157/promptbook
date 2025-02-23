                <!--⚠️ WARNING: This code has been generated so that any manual changes will be overwritten-->

                # `EXPECT` Command

                Expect command describes the desired output of the task *(after post-processing)*

It can set limits for the maximum/minimum length of the output, measured in characters, words, sentences, paragraphs or some other shape of the output.

                ## Example usage

                ```
                - EXPECT MIN 100 Characters
                - EXPECT MAX 10 Words
                - EXPECT EXACTLY 3 Sentences
                - EXPECT EXACTLY 1 Paragraph
                ```

                ## 🧪 Expectations

                Large language models often do not give you what you need, this is called **prompt drift**, which can ruin the entire [pipeline](https://github.com/webgptorg/promptbook/discussions/64) execution if the problem occurs at the beginning of the middle of the pipeline.

                **BUT** it is often very easy to find out and solve:


                ## Count expectations


                ```markdown
                - EXPECT MIN 5 Words
                - EXPECT MAX 25 Words
                - EXPECT MIN 15 Characters
                - EXPECT MAX 1000 Characters
                - EXPECT MIN 1 Sentence
                - EXPECT MAX 5 Paragraphs
                ```




                ## Format expectations

                ```markdown
                - EXPECT JSON
                ```

                ```markdown
                - EXPECT XML
                ```

                ```markdown
                - EXPECT VCARD
                ```


                ## Format with schema

                ```markdown
                - EXPECT JSON https://promptbook.studio/sample/schemas/contacts.schema.json
                ```


                This is not ready yet, check [📑 Formats](https://github.com/webgptorg/promptbook/discussions/36)

                ---

                See also [✂️ Postprocessing](https://github.com/webgptorg/promptbook/discussions/31) and for more advanced expectations check [👮 Agent adversary expectations](https://github.com/webgptorg/promptbook/discussions/39) and [🔙 Expectation-aware generation](https://github.com/webgptorg/promptbook/discussions/37)


                And in future we would maybe do [🔴 Anomaly detection](https://github.com/webgptorg/promptbook/discussions/40)

                *[All commands](../README.md)* | *[Edit source](https://github.com/webgptorg/promptbook/discussions/30)* | *[Discuss](https://github.com/webgptorg/promptbook/discussions/30)*
