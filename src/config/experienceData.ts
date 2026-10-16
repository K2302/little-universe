// ============================================================================
// CENTRAL CONFIGURATION: bilingual copy in Kaushik's actual texting voice
// ============================================================================

export type LangMode = 'en' | 'vi' | 'both';

export interface Bi {
  en: string;
  vi: string;
}

export function tBlock(text: Bi, lang: LangMode): string {
  if (lang === 'en') return text.en;
  if (lang === 'vi') return text.vi;
  if (text.en.trim() === text.vi.trim()) return text.en;
  return `${text.en}\n\n${text.vi}`;
}

export function tLine(text: Bi, lang: LangMode): string {
  if (lang === 'en') return text.en;
  if (lang === 'vi') return text.vi;
  if (text.en.trim() === text.vi.trim()) return text.en;
  return `${text.en} · ${text.vi}`;
}

export interface StarMemory {
  id: string;
  label: Bi;
  category: 'Memory' | 'Inside Joke' | 'Meaningful Conversation' | 'What I Love About You';
  datePlaceholder: Bi;
  title: Bi;
  content: Bi;
  position: [number, number, number];
}

export interface GardenItem {
  id: string;
  objectName: Bi;
  promptType: Bi;
  title: Bi;
  placeholderNote: Bi;
  position: [number, number, number];
  color: string;
}

export interface MiniGameCollectible {
  id: string;
  name: Bi;
  category: Bi;
  message: Bi;
  position: [number, number, number];
  color: string;
}

export interface UnsentLetter {
  id: string;
  title: Bi;
  subtitle: Bi;
  salutation: Bi;
  body: Bi[];
  signoff: Bi;
  isMainHandwritten?: boolean;
  position: [number, number, number];
}

export interface FutureDoorway {
  id: string;
  label: Bi;
  title: Bi;
  dreamDescription: Bi;
  personalNotePlaceholder: Bi;
  color: string;
  position: [number, number, number];
}

export interface ExperienceConfig {
  herName: string;
  myName: string;
  distanceLabel: Bi;
  specialDate: Bi;
  ui: {
    headerTitle: Bi;
    sceneTitles: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, Bi>;
    soundOn: Bi;
    soundMuted: Bi;
    motionFull: Bi;
    motionReduced: Bi;
    mode3d: Bi;
    mode2d: Bi;
    continueJourney: Bi;
    replay: Bi;
    keepExploring: Bi;
    openFinalLetter: Bi;
    backToBridge: Bi;
    lowPowerNote: Bi;
  };
  scene1: {
    openingLine1: Bi;
    openingLine2: Bi;
    ctaButton: Bi;
  };
  scene2: {
    quote: Bi;
    subtitle: Bi;
    stars: StarMemory[];
  };
  scene3: {
    completionQuote: Bi;
    items: GardenItem[];
  };
  scene4: {
    title: Bi;
    instructions: Bi;
    chestTitle: Bi;
    chestMessage: Bi;
    collectibles: MiniGameCollectible[];
  };
  scene5: {
    roomTitle: Bi;
    letters: UnsentLetter[];
  };
  scene6: {
    quoteLine1: Bi;
    quoteLine2: Bi;
    doorways: FutureDoorway[];
  };
  scene7: {
    giftPrompt: Bi;
    finalLetterParagraphs: Bi[];
    signoffLine: Bi;
  };
}

export function letterBody(letter: UnsentLetter, lang: LangMode): string {
  const parts = [letter.salutation, ...letter.body, letter.signoff];
  if (lang === 'both') {
    return [
      parts.map((p) => p.en).join('\n\n'),
      parts.map((p) => p.vi).join('\n\n'),
    ].join('\n\n');
  }
  return parts.map((p) => (lang === 'vi' ? p.vi : p.en)).join('\n\n');
}

export const defaultExperienceData: ExperienceConfig = {
  herName: 'Linh',
  myName: 'Kaushik',
  distanceLabel: {
    en: 'every mile between hanoi and here 🥺',
    vi: 'từng km giữa hà nội và chỗ anh 🥺',
  },
  specialDate: {
    en: 'ur birthday babe',
    vi: 'sinh nhật em babe',
  },

  ui: {
    headerTitle: {
      en: 'a little universe for Linh',
      vi: 'một vũ trụ nhỏ cho Linh',
    },
    sceneTitles: {
      1: { en: 'I. the invitation', vi: 'I. lời mời' },
      2: { en: 'II. the distance between us', vi: 'II. khoảng cách giữa mình' },
      3: { en: 'III. memory garden', vi: 'III. vườn nhớ' },
      4: { en: 'IV. collect the little things', vi: 'IV. nhặt những thứ nhỏ' },
      5: { en: 'V. unsent letters', vi: 'V. thư chưa gửi' },
      6: { en: 'VI. our future little world', vi: 'VI. thế giới nhỏ sau này' },
      7: { en: 'VII. the final meeting', vi: 'VII. lần gặp cuối' },
    },
    soundOn: { en: 'sound: on', vi: 'âm thanh: bật' },
    soundMuted: { en: 'sound: muted', vi: 'âm thanh: tắt' },
    motionFull: { en: 'motion: full', vi: 'chuyển động: đủ' },
    motionReduced: { en: 'motion: reduced', vi: 'chuyển động: giảm' },
    mode3d: { en: 'mode: 3D', vi: 'chế độ: 3D' },
    mode2d: { en: 'mode: 2D lite', vi: 'chế độ: 2D nhẹ' },
    continueJourney: { en: 'continue nha →', vi: 'đi tiếp nha →' },
    replay: { en: '↺ replay from start', vi: '↺ xem lại từ đầu' },
    keepExploring: { en: 'keep exploring', vi: 'xem tiếp đi' },
    openFinalLetter: { en: 'open final birthday letter', vi: 'mở thư sinh nhật' },
    backToBridge: { en: 'back to star bridge', vi: 'về cầu sao' },
    lowPowerNote: {
      en: '2D starlight mode on (3D paused for battery)',
      vi: 'chế độ sao 2D (tắt 3D cho đỡ tốn pin)',
    },
  },

  scene1: {
    openingLine1: {
      en: 'babe\nsomewhere between yr extra classes and my late night texts\nu make this distance feel smaller 🥺',
      vi: 'babe\nở giữa giờ học thêm của em và tin nhắn đêm của anh\nem làm khoảng cách này nhỏ lại 🥺',
    },
    openingLine2: {
      en: 'linh\ntoday this little universe is for u',
      vi: 'linh\nhôm nay vũ trụ nhỏ này là của em',
    },
    ctaButton: {
      en: 'enter ur little universe babe',
      vi: 'vào vũ trụ nhỏ của em đi babe',
    },
  },

  scene2: {
    quote: {
      en: 'if i could ignore every mile between hanoi and here\ni would already be there\nwaiting like i promised 🥺',
      vi: 'nếu anh bỏ hết từng km giữa hà nội và đây\nanh đã ở đó rồi\nchờ như anh đã hứa 🥺',
    },
    subtitle: {
      en: 'drag around. click each star. its our little bridge',
      vi: 'kéo xem. bấm từng ngôi sao. cầu nhỏ của mình đó',
    },
    stars: [
      {
        id: 'star-1',
        label: { en: 'star I', vi: 'sao I' },
        category: 'Memory',
        datePlaceholder: {
          en: '8 april — how are you today?',
          vi: '8 tháng 4 — hôm nay em thế nào?',
        },
        title: {
          en: 'the first message',
          vi: 'tin nhắn đầu',
        },
        content: {
          en: 'u wrote "how are you today?" on 8 april\nand i sent stickers like an idiot and "goood wbu"\n\nthousands of messages later i still check how u are\nafter extra classes after office after business trip back to hanoi\n\nmiss uuu from that day 🥺',
          vi: 'em nhắn "hôm nay em thế nào?" ngày 8 tháng 4\nanh gửi sticker ngớ ngẩn rồi "goood wbu"\n\nbao nhiêu tin rồi anh vẫn hỏi em sao\nsau học thêm sau văn phòng sau công tác về hà nội\n\nnhớ emmmm từ hôm đó 🥺',
        },
        position: [-4.2, 1.2, 0.8],
      },
      {
        id: 'star-2',
        label: { en: 'star II', vi: 'sao II' },
        category: 'Inside Joke',
        datePlaceholder: {
          en: 'okiieee babe',
          vi: 'okiieee babe',
        },
        title: {
          en: 'okiieee / miss uuu / loveeee u',
          vi: 'okiieee / nhớ emmmm / yêu emmmm',
        },
        content: {
          en: 'we stretch words till they look broken\nokiieee\nmissssss uuuuu\nloveeee u\nkisssiii uuu\ngood nyt babe lob u\n\nanybody else thinks keyboard broken\ni just hear u in every extra letter 🥺',
          vi: 'mình kéo chữ đến lúc nhìn như hỏng bàn phím\nokiieee\nnhớ emmmmm\nyêu emmmm\nkisssiii uuu\ngood nyt babe lob u\n\nngười khác tưởng lỗi máy\nanh thì nghe giọng em trong từng chữ kéo dài 🥺',
        },
        position: [-2.5, 1.9, -0.4],
      },
      {
        id: 'star-3',
        label: { en: 'star III', vi: 'sao III' },
        category: 'Meaningful Conversation',
        datePlaceholder: {
          en: 'hanoi has me 😂😂',
          vi: 'hà nội có em 😂😂',
        },
        title: {
          en: 'hanoi has me',
          vi: 'hà nội có em',
        },
        content: {
          en: 'u said how about we go to vietnam\nthen u said hanoi has me 😂😂\n\nbabe that line still sits in my chest\ndistance stopped being a theory\nit became a city with u in it waiting\n\ni wanna be there so bad 🥺',
          vi: 'em nói mình tới việt nam đi\nrồi em nói hà nội có em 😂😂\n\nbabe câu đó vẫn nằm trong ngực anh\nkhoảng cách hết còn là lý thuyết\nnó thành một thành phố có em đang chờ\n\nanh muốn ở đó lắm 🥺',
        },
        position: [-0.8, 2.3, 0.5],
      },
      {
        id: 'star-4',
        label: { en: 'star IV', vi: 'sao IV' },
        category: 'What I Love About You',
        datePlaceholder: {
          en: 'always true',
          vi: 'luôn luôn',
        },
        title: {
          en: 'u still take care of me from another country',
          vi: 'em vẫn lo cho anh từ nước khác',
        },
        content: {
          en: 'u tell me did you eat\ntake care babe\nfocus on class\ntake a few days off\n\nu pack for 4 day business trip and still send love uuuuuuuu\nu busy as hell office extra classes events\nand u still leave a light on for me\n\nlove you alot 🥺',
          vi: 'em hỏi anh ăn chưa\ntake care babe\ntập trung học đi\nnghỉ vài ngày đi\n\nem đi công tác 4 ngày vẫn gửi yêu emmmmm\nem bận kinh khủng văn phòng học thêm event\nmà vẫn để đèn cho anh\n\nyêu em nhiều lắm 🥺',
        },
        position: [0.9, 2.3, -0.3],
      },
      {
        id: 'star-5',
        label: { en: 'star V', vi: 'sao V' },
        category: 'Inside Joke',
        datePlaceholder: {
          en: 'the goodnight tax',
          vi: 'thuế chúc ngủ ngon',
        },
        title: {
          en: 'u cant sleep without goodnight',
          vi: 'em ngủ không được nếu chưa goodnight',
        },
        content: {
          en: 'u keep reminding me\ni cant sleep without a goodnight wish\nsometimes u wait\nsometimes u pout\n\nso here it is stored in the stars\ngood nyt babe lob u\ni wont forget 🥺',
          vi: 'em nhắc hoài\nem ngủ không được nếu chưa được chúc goodnight\ncó lúc em chờ\ncó lúc em dỗi\n\nthì đây nè anh để trên sao luôn\ngood nyt babe lob u\nanh không quên đâu 🥺',
        },
        position: [2.6, 1.8, 0.6],
      },
      {
        id: 'star-6',
        label: { en: 'star VI', vi: 'sao VI' },
        category: 'What I Love About You',
        datePlaceholder: {
          en: 'every single day',
          vi: 'mỗi ngày',
        },
        title: {
          en: 'babe cưng chị whatever\nstill u',
          vi: 'babe cưng chị gì cũng được\nvẫn là em',
        },
        content: {
          en: 'u joked call me older sister babe\nu call me cưng\nu said my voice is beautiful n im talented then u go extra classes anyway\n\neven thru a chat thousands of miles away\nu still the warmest person in any timezone\n\nbye bye love you babg 🥺',
          vi: 'em đùa gọi chị đi babe\nem gọi anh là cưng\nem khen giọng anh đẹp anh tài rồi em vẫn đi học thêm\n\nqua cái chat cách mấy nghìn km\nem vẫn là người ấm nhất mọi múi giờ\n\nbye bye love you babg 🥺',
        },
        position: [4.2, 1.2, -0.2],
      },
    ],
  },

  scene3: {
    completionQuote: {
      en: 'the small chats became my favourite memories\nextra classes potatoes goodnight 🥺',
      vi: 'mấy chat nhỏ thành kỷ niệm anh thích nhất\nhọc thêm khoai tây chúc ngủ ngon 🥺',
    },
    items: [
      {
        id: 'garden-1',
        objectName: { en: 'moon lily', vi: 'hoa huệ trăng' },
        promptType: {
          en: 'a little thing i noticed',
          vi: 'chuyện nhỏ anh để ý',
        },
        title: {
          en: 'u go extra classes then u still text me',
          vi: 'em đi học thêm rồi em vẫn nhắn anh',
        },
        placeholderNote: {
          en: 'u disappear into extra classes office werewolf event\nthen u pop back\nbabe\ncưng\nim busy going to extra classes now babe\n\ni noticed u never let a whole day stay empty if u can help it\n\ni keep waiting to see if you come online 🥺',
          vi: 'em biến vào học thêm văn phòng event ma sói\nrồi em ló ra\nbabe\ncưng\nbây giờ em bận đi học thêm babe\n\nanh để ý em không để cả ngày trống nếu em còn kịp\n\nanh cứ chờ xem em lên online không 🥺',
        },
        position: [-3.8, 0.35, 2.2],
        color: '#f4b8c8',
      },
      {
        id: 'garden-2',
        objectName: { en: 'star boat', vi: 'thuyền sao' },
        promptType: {
          en: 'a memory that still makes me smile',
          vi: 'ký ức vẫn làm anh cười',
        },
        title: {
          en: 'potatoes pho bun dau\nidk why but i smile',
          vi: 'khoai tây phở bún đậu\nkhông biết sao nhưng anh cười',
        },
        placeholderNote: {
          en: 'u wanted potatoes\nu said u will make me try bun dau mam tom 😂😂\ni said i will try to make pho today\n\npotato smoothie haha\nsteamed buns\nwhat u ate babe\n\nwe eat in two countries and food still feels like us 🥺',
          vi: 'em thèm khoai tây\nem nói cho anh thử bún đậu mắm tôm 😂😂\nanh nói hôm nay anh thử nấu phở\n\nsinh tố khoai haha\nbánh bao\nem ăn gì rồi babe\n\nmình ăn hai nước mà đồ ăn vẫn cảm giác là mình 🥺',
        },
        position: [1.5, 0.12, 2.6],
        color: '#80d8ff',
      },
      {
        id: 'garden-3',
        objectName: { en: 'amber lantern', vi: 'đèn hổ phách' },
        promptType: {
          en: 'something u do that makes my life better',
          vi: 'em làm gì khiến ngày anh dễ thở hơn',
        },
        title: {
          en: 'u wait\nand u still tell me to rest',
          vi: 'em chờ\nrồi em vẫn bảo anh nghỉ',
        },
        placeholderNote: {
          en: 'u stay up waiting to see if i come back\nu say sleep well take a few days off eat dinner then extra classes\n\nhard day at office then miss u from u\nand the whole timezone feels kinder\n\ntake care babe 🥺',
          vi: 'em thức chờ xem anh có về không\nem bảo ngủ ngoan nghỉ vài ngày ăn tối rồi đi học thêm\n\nngày sở nặng rồi em gửi nhớ anh\ncả múi giờ dịu lại\n\ntake care babe 🥺',
        },
        position: [-2.2, 2.1, -1.8],
        color: '#f6b96e',
      },
      {
        id: 'garden-4',
        objectName: { en: 'wind chime', vi: 'chuông gió' },
        promptType: {
          en: 'something i admire',
          vi: 'anh ngưỡng mộ điều này',
        },
        title: {
          en: 'u keep going and u still kind',
          vi: 'em vẫn đi tiếp mà em vẫn dịu',
        },
        placeholderNote: {
          en: 'hanoi traffic motorbike branch office extra classes at night\nand u still send come here let me give you a hug to recharge for the new day\n\ncry babe i know you are strong but sometimes it relieves\nalthough m not there to wipe your tears\n\nu tired and still gentle\ni notice 🥺',
          vi: 'xe hà nội xe máy văn phòng tỉnh học thêm buổi tối\nmà em vẫn nhắn lại đây để chị ôm cho recharge ngày mới\n\nkhóc đi babe anh biết em mạnh nhưng đôi lúc cần khóc\ndù anh không ở đó lau nước mắt\n\nem mệt mà vẫn dịu\nanh để ý 🥺',
        },
        position: [3.6, 0.6, -1.2],
        color: '#b8a9e0',
      },
      {
        id: 'garden-5',
        objectName: { en: 'root blossom', vi: 'hoa rễ sáng' },
        promptType: {
          en: 'a promise i mean',
          vi: 'lời hứa anh nghiêm túc',
        },
        title: {
          en: 'i will come to vietnam',
          vi: 'anh sẽ sang việt nam',
        },
        placeholderNote: {
          en: 'u said try to keep your promise to come to vietnam\nu said i will wait for you when you come to vietnam\nmaybe a few more years\n\nbabe i mean it\nhoc tieng viet di cung i heard u\ni will learn\n\nyour knight will be waiting 🥺',
          vi: 'em bảo cố giữ lời hứa sang việt nam\nem bảo em sẽ chờ khi anh tới việt nam\ncó khi thêm vài năm\n\nbabe anh nghiêm túc\nhọc tiếng việt đi cưng anh nghe rồi\nanh sẽ học\n\nhiệp sĩ của em sẽ chờ 🥺',
        },
        position: [0.0, 0.4, -0.8],
        color: '#ffd280',
      },
    ],
  },

  scene4: {
    title: {
      en: 'collect the little things',
      vi: 'nhặt những thứ nhỏ',
    },
    instructions: {
      en: 'wasd / arrows / tap the meadow. grab all 5 glowing things babe',
      vi: 'wasd / mũi tên / chạm bãi cỏ. lấy đủ 5 thứ phát sáng babe',
    },
    chestTitle: {
      en: 'a starfield in glass',
      vi: 'trời sao trong thủy tinh',
    },
    chestMessage: {
      en: 'every okiieee every goodnight every star 521 knight every extra class babe\nsafe in here\nwaiting for the day hanoi isnt just a chat 🥺',
      vi: 'từng okiieee từng goodnight từng knight star 521 từng babe học thêm\nđể trong này hết\nchờ ngày hà nội không chỉ là cái chat 🥺',
    },
    collectibles: [
      {
        id: 'collect-1',
        name: { en: 'a shared laugh', vi: 'một trận cười chung' },
        category: { en: 'joy', vi: 'vui' },
        message: {
          en: 'for potato smoothie sticker dump hanoi has me\nand u laughing like crazy at something only we find funny\nmeee laughing tooo 🥺',
          vi: 'cho sinh tố khoai dump sticker hà nội có em\nvà em cười điên vì chuyện chỉ mình hiểu\nanh cũng cười theo á 🥺',
        },
        position: [-4.0, 0.6, -2.5],
        color: '#ffd280',
      },
      {
        id: 'collect-2',
        name: { en: 'late night chat', vi: 'chat đêm khuya' },
        category: { en: 'connection', vi: 'gần nhau' },
        message: {
          en: 'for 1am when u cant sleep without goodnight\nand im still online from another country\njust us and the chat\n\nwhat you doing babe',
          vi: 'cho 1 giờ sáng em ngủ không được nếu chưa goodnight\nanh vẫn online từ nước khác\nchỉ có mình và cái chat\n\nem đang làm gì babe',
        },
        position: [4.2, 0.6, -2.2],
        color: '#b8a9e0',
      },
      {
        id: 'collect-3',
        name: { en: 'a comforting message', vi: 'tin nhắn ấm' },
        category: { en: 'warmth', vi: 'ấm' },
        message: {
          en: 'for come here let me give you a hug to recharge for the new day\nand love uuuuuuuu on days i needed it more than i said\n\nbe strong babe 🥺',
          vi: 'cho tin em ôm anh recharge ngày mới\nvà yêu emmmmm những ngày anh cần hơn anh dám nói\n\nbe strong babe 🥺',
        },
        position: [-3.5, 0.6, 3.0],
        color: '#f4b8c8',
      },
      {
        id: 'collect-4',
        name: { en: 'inside joke', vi: 'trò riêng' },
        category: { en: 'play', vi: 'nghịch' },
        message: {
          en: 'for knights arena star 521 kc events\nand u teasing perhaps all i can think about is star 521 😂😂😂😂\n\nmaybe a little babe',
          vi: 'cho knight arena star 521 event kc\nvà em trêu chắc anh chỉ nghĩ star 521 😂😂😂😂\n\ncũng hơi đúng babe',
        },
        position: [3.8, 0.6, 2.8],
        color: '#7ee8fa',
      },
      {
        id: 'collect-5',
        name: { en: 'a future adventure', vi: 'chuyến đi chưa tới' },
        category: { en: 'hope', vi: 'hy vọng' },
        message: {
          en: 'for hanoi culture da nang beach\nthe date u already asked for\nand vietnamese u keep teaching me till i can say more than okiieee\n\nhoc tieng viet di cung 🥺',
          vi: 'cho hà nội văn hóa đà nẵng biển\nbuổi hẹn em đã đòi\nvà tiếng việt em dạy đến lúc anh nói được hơn okiieee\n\nhọc tiếng việt đi cưng 🥺',
        },
        position: [0.0, 0.6, -4.2],
        color: '#f6b96e',
      },
    ],
  },

  scene5: {
    roomTitle: {
      en: 'room of unsent letters',
      vi: 'phòng thư chưa gửi',
    },
    letters: [
      {
        id: 'letter-1',
        title: {
          en: 'what i wish i could tell u in person',
          vi: 'anh muốn nói khi gặp em',
        },
        subtitle: {
          en: 'floating note I · by the lamp',
          vi: 'mảnh I · cạnh đèn',
        },
        salutation: { en: 'babe linh,', vi: 'babe linh,' },
        body: [
          {
            en: 'if i was sitting across from u in hanoi i wouldnt start a big speech',
            vi: 'nếu anh ngồi đối diện em ở hà nội anh không diễn văn dài đâu',
          },
          {
            en: 'u said u will sing for me when we meet\nand when we meet i will lull u to sleep\n\ni would just look at u take ur hand and say the thing chat never holds\ni hate the distance too\nim still here',
            vi: 'em nói gặp anh em sẽ hát\nvà gặp nhau em sẽ ru anh ngủ\n\nanh chỉ nhìn em nắm tay rồi nói điều chat không giữ nổi\nanh cũng ghét khoảng cách\nanh vẫn ở đây',
          },
          {
            en: 'then i finally say goodnight the way u asked\nnot typed not late\njust close enough to hear\n\ngood nyt babe lob u 🥺',
            vi: 'rồi anh chúc ngủ ngon như em đòi\nkhông gõ không trễ\ngần đủ để nghe\n\ngood nyt babe lob u 🥺',
          },
        ],
        signoff: {
          en: 'miss uuu\nkaushik',
          vi: 'nhớ emmmm\nkaushik',
        },
        position: [-2.4, 1.5, 0.8],
      },
      {
        id: 'letter-2',
        title: {
          en: 'things i hope u never forget',
          vi: 'những thứ anh mong em đừng quên',
        },
        subtitle: {
          en: 'floating note II · rain window',
          vi: 'mảnh II · cửa sổ mưa',
        },
        salutation: { en: 'hey u,', vi: 'này em,' },
        body: [
          {
            en: 'extra classes + office stacking\ni wish u could borrow my eyes for 5 min',
            vi: 'học thêm cộng văn phòng chồng lên\nanh ước em mượn mắt anh 5 phút',
          },
          {
            en: 'u still ask how i am\nu wait\nu said youre talented youll definitely succeed while carrying ur own week\nfunny in two languages\nkinder than u are busy and u are VERY busy',
            vi: 'em vẫn hỏi anh sao\nem chờ\nem bảo anh tài anh sẽ được trong lúc tuần em cũng nặng\nhài hước hai thứ tiếng\ndịu hơn cả độ bận và em BẬN lắm',
          },
          {
            en: 'dont forget\nhanoi has u\nand thats already a lot of light in one city\n\nu slay in every color babe ❤️',
            vi: 'đừng quên\hà nội có em\nthế là đã nhiều ánh sáng trong một thành phố rồi\n\nu slay in every color babe ❤️',
          },
        ],
        signoff: {
          en: 'always in ur corner\nkaushik',
          vi: 'luôn đứng về phía em\nkaushik',
        },
        position: [2.3, 1.8, 0.5],
      },
      {
        id: 'letter-3',
        title: {
          en: 'what i look forward to doing with u',
          vi: 'anh mong làm gì với em',
        },
        subtitle: {
          en: 'floating note III · bookshelf',
          vi: 'mảnh III · kệ sách',
        },
        salutation: { en: 'linh,', vi: 'linh ơi,' },
        body: [
          {
            en: 'da nang for beach hanoi for cultural things yes\nbut i also want the boring hours',
            vi: 'đà nẵng biển hà nội văn hóa thì có\nnhưng anh cũng muốn mấy giờ nhàm',
          },
          {
            en: 'eat pho together\nu make me try bun dau mam tom 😂\nsit in the cafe u wanted sponsored\nplay arena on the same sofa so star 521 isnt a chat its a couch fight',
            vi: 'ăn phở cùng nhau\nem bắt anh thử bún đậu mắm tôm 😂\nngồi quán cafe em bảo tài trợ\nchơi arena chung ghế để star 521 không còn là chat mà là cãi trên sofa',
          },
          {
            en: 'after extra classes dinner walk real goodnight\nu already said youre waiting for me to take u on a date\nim still holding that\n\ni alwaye wait for you 🥺',
            vi: 'sau học thêm ăn tối đi bộ goodnight thật\nem đã nói đang chờ anh đưa đi date\nanh vẫn giữ câu đó\n\nanh luôn chờ em 🥺',
          },
        ],
        signoff: {
          en: 'counting the days\nkaushik',
          vi: 'đếm ngày\nkaushik',
        },
        position: [-1.5, 2.2, -1.2],
      },
      {
        id: 'letter-4',
        title: {
          en: 'for days distance feels heavy',
          vi: 'những ngày khoảng cách nặng',
        },
        subtitle: {
          en: 'floating note IV · cloud bed',
          vi: 'mảnh IV · giường mây',
        },
        salutation: {
          en: 'for when the miles feel heavy,',
          vi: 'khi từng km nặng quá,',
        },
        body: [
          {
            en: 'u said i miss you but cant do anything i hate distance 😭\ni said i hate distances too\nwe dont have to pretend india to hanoi is easy',
            vi: 'em nói nhớ anh mà chẳng làm được gì ghét khoảng cách 😭\nanh cũng nói anh ghét khoảng cách\nkhông cần giả vờ ấn độ tới hà nội là dễ',
          },
          {
            en: 'days when a screen isnt enough\nu wait i come back late extra classes eat the evening\nremember we on the same team\nu said u will wait maybe a few more years\ni hear that i wont treat it lightly',
            vi: 'ngày màn hình không đủ\nem chờ anh về trễ học thêm nuốt hết tối\nnhớ là mình cùng đội\nem nói em chờ có khi thêm vài năm\nanh nghe rồi anh không xem nhẹ',
          },
          {
            en: 'long distance is trust thats it\nu and me one honest day at a time\n\nyour knight will be waiting 🥺',
            vi: 'yêu xa là tin nhau vậy thôi\nem với anh từng ngày thật\n\nhiệp sĩ của em sẽ chờ 🥺',
          },
        ],
        signoff: {
          en: 'holding u close in thought\nkaushik',
          vi: 'ôm em trong đầu\nkaushik',
        },
        position: [1.8, 1.3, -1.1],
      },
      {
        id: 'letter-main',
        title: {
          en: 'handwritten from my desk',
          vi: 'viết tay từ bàn anh',
        },
        subtitle: {
          en: 'main letter · on the wood desk',
          vi: 'thư chính · trên bàn gỗ',
        },
        salutation: {
          en: 'happy birthday linh,',
          vi: 'chúc mừng sinh nhật linh,',
        },
        body: [
          {
            en: 'i built this little room in the clouds so u have a quiet place after extra classes when u still wanna feel close',
            vi: 'anh làm căn phòng mây này để em có chỗ yên sau học thêm lúc em vẫn muốn gần',
          },
          {
            en: 'thank u for 8 april\nfor tens of thousands of messages\nfor hoc tieng viet di cung\nfor every love uuuuuuuu\nfor waiting',
            vi: 'cảm ơn em vì 8 tháng 4\nvì hàng chục ngàn tin\nvì học tiếng việt đi cưng\nvì từng yêu emmmmm\nvì đã chờ',
          },
          {
            en: 'today is urs\neat something good\ni hope someone in hanoi tells u youre loved\nand if they dont this letter will\n\n1 2 3 yêu cưng\nloveeee u 🥺',
            vi: 'hôm nay là của em\năn gì ngon đi\nanh mong ở hà nội có người nói em được yêu\nkhông có thì thư này nói\n\n1 2 3 yêu cưng\nloveeee u 🥺',
          },
        ],
        signoff: {
          en: 'yours\nkaushik',
          vi: 'của em\nkaushik',
        },
        isMainHandwritten: true,
        position: [0.0, 0.85, 1.5],
      },
    ],
  },

  scene6: {
    quoteLine1: {
      en: 'there are so many little things i havent done with u yet',
      vi: 'còn bao chuyện nhỏ anh chưa làm cùng em',
    },
    quoteLine2: {
      en: 'hanoi da nang a real goodnight\ni think thats one of my favourite things about us 🥺',
      vi: 'hà nội đà nẵng một goodnight thật\nanh nghĩ đó là thứ anh thích ở mình 🥺',
    },
    doorways: [
      {
        id: 'door-1',
        label: { en: 'door I', vi: 'cửa I' },
        title: { en: 'ur cafe finally', vi: 'quán cafe của em' },
        dreamDescription: {
          en: 'small table in hanoi\npho coffee that might make u say say cafe\nand the shop u asked me to sponsor when i become billionaire',
          vi: 'bàn nhỏ ở hà nội\nphở cafe có khi em bảo say cafe\nvà quán em bảo anh tài trợ khi anh thành tỷ phú',
        },
        personalNotePlaceholder: {
          en: 'i said i will work hard so u can open a coffee shop\nfirst date i take u out after u already ate\nexactly like u asked\n\nwaiting for you to take me on a date... i didnt forget 🥺',
          vi: 'anh nói anh sẽ làm chăm để em mở quán cafe\ndate đầu anh đưa em đi sau khi em ăn rồi\nđúng như em đòi\n\nem bảo chờ anh đưa đi date... anh không quên 🥺',
        },
        color: '#f6b96e',
        position: [-3.8, 0.9, 2.5],
      },
      {
        id: 'door-2',
        label: { en: 'door II', vi: 'cửa II' },
        title: { en: 'slow hanoi evening', vi: 'chiều hà nội chậm' },
        dreamDescription: {
          en: 'motorbike past the jam then walking nowhere urgent\nimperial academy warm lights\nu pointing at the city u already know',
          vi: 'xe máy vượt kẹt rồi đi bộ chẳng vội\nvăn miếu đèn ấm\nem chỉ thành phố em đã thuộc',
        },
        personalNotePlaceholder: {
          en: 'u prefer motorbike\ni want the hanoi that exists when u not on business trip and im not a chat bubble 🥺',
          vi: 'em thích xe máy\nanh muốn hà nội lúc em không đi công tác và anh không phải bong bóng chat 🥺',
        },
        color: '#f4b8c8',
        position: [-1.9, 1.0, 0.5],
      },
      {
        id: 'door-3',
        label: { en: 'door III', vi: 'cửa III' },
        title: { en: 'da nang for the beach', vi: 'đà nẵng vì biển' },
        dreamDescription: {
          en: 'hanoi for cultural things da nang for beach\nget a little lost take blurry photos\nfind a stretch of sand that becomes ours',
          vi: 'hà nội văn hóa đà nẵng biển\nlạc một chút chụp ảnh mờ\ntìm một khúc cát thành của mình',
        },
        personalNotePlaceholder: {
          en: 'u asked will you go to the beach with me tomorrow\neven rainy crowded day counts\ni still want that tomorrow 🥺',
          vi: 'em hỏi ngày mai anh đi biển với em không\nngày mưa đông người cũng tính\nanh vẫn muốn cái ngày mai đó 🥺',
        },
        color: '#ffd280',
        position: [0.0, 1.1, -1.5],
      },
      {
        id: 'door-4',
        label: { en: 'door IV', vi: 'cửa IV' },
        title: { en: 'knights on the same couch', vi: 'knight chung một ghế' },
        dreamDescription: {
          en: 'no lag no play my arena from another country\nstar 521 knights werewolf events snacks nearby\nlaughing when everything goes sideways',
          vi: 'không lag không play arena hộ từ nước khác\nstar 521 knight event ma sói đồ ăn cạnh ghế\ncười khi mọi thứ đổ bể',
        },
        personalNotePlaceholder: {
          en: 'u teased perhaps all u can think about is star 521 😂😂😂😂\nfine then sit next to me and prove me wrong in person babe',
          vi: 'em trêu chắc anh chỉ nghĩ star 521 😂😂😂😂\nthôi ngồi cạnh anh rồi chứng minh sai đi babe',
        },
        color: '#b8a9e0',
        position: [1.9, 1.2, -3.5],
      },
      {
        id: 'door-5',
        label: { en: 'door V', vi: 'cửa V' },
        title: { en: 'ordinary day after extra classes', vi: 'ngày thường sau học thêm' },
        dreamDescription: {
          en: 'no plan\nu come home from class we eat\nu teach me vietnamese i say goodnight without a screen\nnobody has to wait',
          vi: 'không lịch\nem về từ lớp mình ăn\nem dạy anh tiếng việt anh chúc ngủ ngon không cần màn hình\nkhông ai phải chờ',
        },
        personalNotePlaceholder: {
          en: 'u said when we meet i will lull u to sleep\ni want the boring sunday where thats not a promise its just evening\n\nokiieee babe 🥺',
          vi: 'em nói gặp nhau em sẽ ru anh ngủ\nanh muốn chủ nhật nhàm lúc đó không phải lời hứa mà chỉ là buổi tối\n\nokiieee babe 🥺',
        },
        color: '#80d8ff',
        position: [3.8, 1.3, -5.5],
      },
    ],
  },

  scene7: {
    giftPrompt: {
      en: 'click the birthday gift under the star tree babe',
      vi: 'bấm quà sinh nhật dưới cây sao đi babe',
    },
    finalLetterParagraphs: [
      {
        en: 'happy birthday linh',
        vi: 'chúc mừng sinh nhật linh',
      },
      {
        en: 'if i could give u anything today\nit wouldnt just be flowers or a gift',
        vi: 'nếu anh cho em được gì hôm nay\nkhông chỉ hoa hay quà',
      },
      {
        en: 'id give u all the ordinary little moments\nhanoi and india keep asking us to wait for',
        vi: 'anh muốn cho em hết những lúc nhỏ nhàm\nmà hà nội và ấn độ bắt mình chờ',
      },
      {
        en: 'extra class evenings\ngoodnight that isnt typed\nsilly okiieee and miss uuu\ndays being together doesnt need a special occasion',
        vi: 'tối học thêm\ngoodnight không phải gõ\nokiieee ngớ và nhớ emmmm\nngày ở bên nhau không cần dịp đặc biệt',
      },
      {
        en: 'until i can share more of those with u\ni wanted to make u a little world of ur own',
        vi: 'trước khi anh chia được nhiều hơn với em\nanh muốn làm cho em một thế giới nhỏ',
      },
      {
        en: 'full of 8 april\nstar 521 knights\npho and potatoes\nand the promise to come to vietnam',
        vi: 'đầy 8 tháng 4\nknight star 521\nphở và khoai tây\nvà lời hứa sang việt nam',
      },
      {
        en: 'today is ur day\ni hope this next chapter gives u reasons to smile\nthings to be proud of\nand rest after extra classes',
        vi: 'hôm nay là ngày em\nanh mong chương mới cho em lý do cười\nthứ để tự hào\nvà được nghỉ sau học thêm',
      },
      {
        en: 'and somewhere in my little corner of the world\nthere is someone who is very glad u exist\n\nyour knight will be waiting 🥺',
        vi: 'và góc nhỏ của anh trên thế giới này\ncó người rất mừng vì em tồn tại\n\nhiệp sĩ của em sẽ chờ 🥺',
      },
      {
        en: 'happy birthday ❤️\n1 2 3 yêu cưng\nmissssss youuu soo muchhhhhh\nloveeee u',
        vi: 'chúc mừng sinh nhật ❤️\n1 2 3 yêu cưng\nnhớ emmmmm nhiều lắmmmm\nloveeee u',
      },
    ],
    signoffLine: {
      en: 'made with love just for u\ngood nyt babe lob u\n— kaushik',
      vi: 'làm bằng yêu chỉ cho em\ngood nyt babe lob u\n— kaushik',
    },
  },
};
