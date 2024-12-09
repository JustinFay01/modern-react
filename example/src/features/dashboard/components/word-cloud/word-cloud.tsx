import { Text } from "@visx/text";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";
import { useState } from "react";
import { WordDataHelper } from "@dashboard/util/word-cloud-helper";
import { scaleLog } from "@visx/scale";
import { totoAfricaLyrics } from "@dashboard/assets/text-fixture";
import { SpiralType, WordData } from "@dashboard/types/word-cloud-types";
import { FlexColumn, FlexRow, FlexSpacer } from "@/ui/layout/flexbox";
import { WordCloudOptions } from "./word-cloud-options";
import { Box } from "@mui/material";
import { WordCloudUpload } from "./word-cloud-upload";

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

interface OcrWordCloudProps {
  width: number;
  height: number;
}

export default function OcrWordCloud({ width, height }: OcrWordCloudProps) {
  const [spiralType, setSpiralType] = useState<SpiralType>("archimedean");
  const [withRotation, setWithRotation] = useState(false);
  const words = WordDataHelper.countWordsFromString(totoAfricaLyrics);

  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  });
  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  return (
    <FlexColumn>
      <FlexRow>
        <WordCloudUpload />
        <FlexSpacer />
        <Box
          //Shrink the box to the content size
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <WordCloudOptions
            withRotation={withRotation}
            setWithRotation={setWithRotation}
            spiralType={spiralType}
            setSpiralType={setSpiralType}
          />
        </Box>
      </FlexRow>

      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={"Impact"}
        spiral={spiralType}
        rotate={withRotation ? WordDataHelper.getRotationDegree : 0}
        random={WordDataHelper.fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </FlexColumn>
  );
}
