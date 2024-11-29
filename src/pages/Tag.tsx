import { useEffect, useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { collection, onSnapshot, query, Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useNavigate } from 'react-router-dom';

interface IWord {
  text: string;
  value: number;
}

const colors = ['#143059', '#2F6B9A', '#82a6c2'];

export default function Tag() {
  const navigate = useNavigate();
  const [words, setWords] = useState<IWord[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTags = async () => {
      const tagsQuery = query(
        collection(db, "tags")
      );

      unsubscribe = onSnapshot(tagsQuery, (snapshot) => {
        const tags = snapshot.docs.map(doc => {
          const { name, usageCount } = doc.data();
          return {
            id: doc.id,
            name,
            usageCount
          };
        });
        setWords(tags.map(v => ({ text: v.name, value: v.usageCount })));
      });
    }

    fetchTags();

    return () => { unsubscribe?.(); }
  }, []);

  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [15, 100],
  });
  const fontSizeSetter = (datum: IWord) => fontScale(datum.value);

  return <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl lg:px-8 lg:py-10">
    <div className="wordcloud">
      <ParentSize>{(size) => <Wordcloud
        words={words}
        width={size.width}
        height={450 /*parent div 에 명시된 height 이 없으므로, size.height 값은 0 으로 전달됨. 따라서, 임의로 정한 상수값을 사용하도록 함*/}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={2}
        spiral={"rectangular"}
        rotate={0}
      // random={ () => 0.5}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
              onClick={() => navigate(`/search?tag=${w.text}`)}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
      }</ParentSize>
      <style>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
    </div>
  </div >
}
