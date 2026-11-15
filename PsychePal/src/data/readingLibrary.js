const languages = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
];

const topics = [
  {
    id: 'emotions',
    names: ['Understanding emotions', 'හැඟීම් තේරුම් ගැනීම', 'உணர்வுகளைப் புரிந்துகொள்ளுதல்'],
    intro: ['Feelings can offer information about your needs, without defining who you are.', 'හැඟීම් ඔබේ අවශ්‍යතා ගැන තොරතුරු ලබා දෙයි; ඒවා ඔබේ වටිනාකම තීරණය නොකරයි.', 'உணர்வுகள் உங்கள் தேவைகளைப் பற்றி தெரிவிக்கலாம்; அவை உங்கள் மதிப்பைத் தீர்மானிக்காது.'],
    articles: [
      [['Name the feeling', 'හැඟීමට නමක් දෙන්න', 'உணர்வுக்குப் பெயரிடுங்கள்'], ['Pause and choose a word that fits, such as worried, disappointed, or content.', 'මොහොතක් නැවතී කනස්සල්ල, දුක හෝ සතුට වැනි ගැළපෙන වචනයක් තෝරන්න.', 'சிறிது நின்று கவலை, ஏமாற்றம் அல்லது மகிழ்ச்சி போன்ற பொருத்தமான சொல்லைத் தேர்ந்தெடுங்கள்.']],
      [['Notice your body', 'ශරීරය ගැන අවධානය', 'உடலைக் கவனியுங்கள்'], ['Notice sensations such as tight shoulders or a racing heart without judging yourself.', 'උරහිස් තදවීම හෝ හෘද ස්පන්දනය වැඩිවීම වැනි සංවේදනා විනිශ්චය නොකර නිරීක්ෂණය කරන්න.', 'தோள்களில் இறுக்கம் அல்லது இதயத்துடிப்பு போன்ற உணர்வுகளை உங்களைத் தீர்ப்பிடாமல் கவனியுங்கள்.']],
      [['Feelings can change', 'හැඟීම් වෙනස් විය හැකිය', 'உணர்வுகள் மாறலாம்'], ['Check in again later and notice whether the feeling has changed in strength.', 'පසුව නැවත අවධානය යොමු කර හැඟීමේ තීව්‍රතාව වෙනස් වී ඇත්දැයි බලන්න.', 'பின்னர் மீண்டும் கவனித்து உணர்வின் தீவிரம் மாறியுள்ளதா என்று பாருங்கள்.']],
      [['Make room for mixed feelings', 'මිශ්‍ර හැඟීම්වලට ඉඩ දෙන්න', 'கலவையான உணர்வுகளுக்கு இடமளியுங்கள்'], ['It is possible to feel relieved and sad at the same time; both feelings can be acknowledged.', 'එකවර සහනයක් සහ දුකක් දැනිය හැකිය; හැඟීම් දෙකම පිළිගත හැකිය.', 'ஒரே நேரத்தில் நிம்மதியும் சோகமும் இருக்கலாம்; இரண்டையும் ஏற்றுக்கொள்ளலாம்.']],
      [['Ask what you need', 'ඔබට අවශ්‍ය දේ විමසන්න', 'உங்கள் தேவையைக் கேளுங்கள்'], ['Consider whether you need rest, connection, space, or help with a practical task.', 'ඔබට විවේකය, සමීප කෙනෙකුගේ සහාය, ඉඩක් හෝ වැඩකට උපකාරයක් අවශ්‍ය දැයි සිතන්න.', 'உங்களுக்கு ஓய்வு, தொடர்பு, தனியிடம் அல்லது ஒரு வேலையில் உதவி தேவையா எனச் சிந்தியுங்கள்.']],
    ],
  },
  {
    id: 'stress',
    names: ['Everyday stress', 'දෛනික ආතතිය', 'அன்றாட மன அழுத்தம்'],
    intro: ['Stress can affect attention and energy; small adjustments may make a day more manageable.', 'ආතතිය අවධානයට සහ ශක්තියට බලපෑ හැකිය; කුඩා වෙනස්කම් දවස පහසු කළ හැකිය.', 'மன அழுத்தம் கவனத்தையும் ஆற்றலையும் பாதிக்கலாம்; சிறிய மாற்றங்கள் நாளை எளிதாக்கலாம்.'],
    articles: [
      [['Find the next step', 'ඊළඟ පියවර සොයන්න', 'அடுத்த படியைக் கண்டறியுங்கள்'], ['Break a demanding task into one small action you can begin now.', 'අසීරු කාර්යයක් දැන් ආරම්භ කළ හැකි කුඩා පියවරකට බෙදන්න.', 'கடினமான வேலையை இப்போது தொடங்கக்கூடிய சிறிய செயலாகப் பிரியுங்கள்.']],
      [['Take a short pause', 'කෙටි විවේකයක් ගන්න', 'சிறு இடைவெளி எடுங்கள்'], ['Step away briefly, drink water, or look outside before returning to your task.', 'වැඩට නැවත යාමට පෙර මඳ වේලාවක් ඉවත් වී ජලය පානය කරන්න හෝ පිටත බලන්න.', 'வேலைக்குத் திரும்புமுன் சிறிது ஓய்வெடுத்து தண்ணீர் குடிக்கவும் அல்லது வெளியே பார்க்கவும்.']],
      [['Sort your priorities', 'ප්‍රමුඛතා වෙන් කරන්න', 'முன்னுரிமைகளை வரிசைப்படுத்துங்கள்'], ['Choose what needs attention today and what can wait or be shared.', 'අද කළ යුතු දේ සහ කල් දැමිය හැකි හෝ බෙදා ගත හැකි දේ තෝරන්න.', 'இன்று செய்ய வேண்டியதையும் காத்திருக்கக்கூடிய அல்லது பகிரக்கூடியதையும் தேர்ந்தெடுங்கள்.']],
      [['Notice your signs', 'ඔබේ ලක්ෂණ හඳුනාගන්න', 'உங்கள் அறிகுறிகளைக் கவனியுங்கள்'], ['Notice patterns such as irritability, tiredness, or difficulty concentrating and plan a break.', 'නුරුස්නා බව, තෙහෙට්ටුව හෝ අවධානය අපහසු වීම වැනි රටා හඳුනාගෙන විවේකයක් සැලසුම් කරන්න.', 'எரிச்சல், சோர்வு அல்லது கவனக்குறைவு போன்றவற்றைக் கவனித்து ஓய்வைத் திட்டமிடுங்கள்.']],
      [['Ask for help', 'උදව් ඉල්ලන්න', 'உதவி கேளுங்கள்'], ['Tell someone you trust what feels difficult and ask for a specific kind of support.', 'අපහසු දේ විශ්වාසවන්ත කෙනෙකුට කියා නිශ්චිත උපකාරයක් ඉල්ලන්න.', 'கடினமாக இருப்பதை நம்பகமான ஒருவரிடம் சொல்லி குறிப்பிட்ட உதவியைக் கேளுங்கள்.']],
    ],
  },
  {
    id: 'anxiety',
    names: ['Anxiety and worry', 'කනස්සල්ල සහ බිය', 'பதற்றமும் கவலையும்'],
    intro: ['Worry can be uncomfortable, and support is available if it interferes with daily life.', 'කනස්සල්ල අපහසු විය හැකි අතර එය දෛනික ජීවිතයට බාධා කරයි නම් සහාය ලබාගත හැකිය.', 'கவலை அசௌகரியமாக இருக்கலாம்; அன்றாட வாழ்க்கையைப் பாதித்தால் உதவி பெறலாம்.'],
    articles: [
      [['Return to the present', 'වර්තමානයට අවධානය දෙන්න', 'நிகழ்காலத்திற்குத் திரும்புங்கள்'], ['Name a few things you can see and feel around you, at a comfortable pace.', 'සුවපහසු වේගයකින් ඔබ වටා දැකිය හැකි සහ ස්පර්ශ කළ හැකි දේ කිහිපයක් නම් කරන්න.', 'உங்களுக்கு வசதியான வேகத்தில் சுற்றி பார்க்கவும் உணரவும் முடிந்த சிலவற்றைக் குறிப்பிடுங்கள்.']],
      [['Separate facts and worries', 'කරුණු සහ කනස්සල්ල වෙන් කරන්න', 'உண்மையையும் கவலையையும் பிரியுங்கள்'], ['Write what you know and what you are predicting, without demanding certainty.', 'ඔබ දන්නා කරුණු සහ අනුමාන කරන දේ ලියන්න; සියල්ල නිසැක විය යුතු යැයි බල නොකරන්න.', 'உங்களுக்குத் தெரிந்ததையும் நீங்கள் ஊகிப்பதையும் எழுதுங்கள்; முழு உறுதியை வற்புறுத்தாதீர்கள்.']],
      [['Breathe comfortably', 'සුවපහසුව හුස්ම ගන්න', 'வசதியாகச் சுவாசியுங்கள்'], ['Let your breathing settle naturally; stop any exercise that feels uncomfortable.', 'හුස්ම ස්වාභාවිකව සන්සුන් වීමට ඉඩ දෙන්න; අපහසු ව්‍යායාමයක් නවත්වන්න.', 'சுவாசம் இயல்பாக அமைதியாகட்டும்; அசௌகரியம் தரும் பயிற்சியை நிறுத்துங்கள்.']],
      [['Choose one manageable action', 'කළ හැකි එක් පියවරක් තෝරන්න', 'செய்யக்கூடிய ஒரு செயலைத் தேர்வுசெய்க'], ['If a worry has a practical next step, choose one small action and leave the rest for later.', 'කනස්සල්ලට කළ හැකි පියවරක් තිබේ නම් කුඩා ක්‍රියාවක් තෝරා ඉතිරිය පසුවට තබන්න.', 'கவலைக்கு நடைமுறை அடுத்த படி இருந்தால் ஒரு சிறிய செயலைத் தேர்ந்தெடுத்து மீதியைப் பின்னர் பாருங்கள்.']],
      [['Seek support', 'සහාය සොයන්න', 'ஆதரவை நாடுங்கள்'], ['If anxiety is persistent or disruptive, consider speaking with a qualified professional.', 'කනස්සල්ල දිගටම පවතී නම් හෝ ජීවිතයට බාධා කරයි නම් සුදුසුකම් ලත් වෘත්තිකයෙකු සමඟ කතා කරන්න.', 'பதற்றம் தொடர்ந்தாலோ வாழ்க்கையைப் பாதித்தாலோ தகுதியான நிபுணரிடம் பேசுங்கள்.']],
    ],
  },
  {
    id: 'rest',
    names: ['Rest and sleep', 'විවේකය සහ නින්ද', 'ஓய்வும் தூக்கமும்'],
    intro: ['Rest is a need, not a reward for completing every task.', 'විවේකය සෑම කාර්යයක්ම අවසන් කළ පසු ලැබෙන ත්‍යාගයක් නොව අවශ්‍යතාවකි.', 'ஓய்வு எல்லா வேலைகளையும் முடித்ததற்கான பரிசல்ல; அது ஒரு தேவை.'],
    articles: [
      [['Make a wind-down ritual', 'විවේකයට සූදානම් වන්න', 'அமைதியான இரவு வழக்கத்தை உருவாக்குங்கள்'], ['Choose a calming activity before bed, such as reading or listening to quiet music.', 'නින්දට පෙර කියවීම හෝ මෘදු සංගීතයට සවන් දීම වැනි සන්සුන් ක්‍රියාවක් තෝරන්න.', 'தூங்குமுன் வாசிப்பு அல்லது மென்மையான இசை போன்ற அமைதியான செயலைத் தேர்ந்தெடுங்கள்.']],
      [['Keep a steady routine', 'ස්ථාවර දින චර්යාවක් තබාගන්න', 'சீரான வழக்கத்தைப் பின்பற்றுங்கள்'], ['Where possible, keep a similar waking time and adjust your routine to your needs.', 'හැකි විට සමාන වේලාවක අවදි වී ඔබේ අවශ්‍යතාවට අනුව දින චර්යාව සකස් කරන්න.', 'முடிந்தவரை ஒரே நேரத்தில் விழித்து உங்கள் தேவைக்கேற்ப வழக்கத்தை மாற்றுங்கள்.']],
      [['Make space for breaks', 'විවේකයට ඉඩ දෙන්න', 'இடைவேளைக்கு இடமளியுங்கள்'], ['A short pause during the day can be useful even when your work is unfinished.', 'වැඩ අවසන් නොවූවත් දවස තුළ කෙටි විවේකයක් ප්‍රයෝජනවත් විය හැකිය.', 'வேலை முடியாவிட்டாலும் பகலில் சிறு இடைவெளி உதவியாக இருக்கும்.']],
      [['Notice your environment', 'පරිසරය ගැන සිතන්න', 'உங்கள் சூழலைக் கவனியுங்கள்'], ['If you can, make your resting space comfortable and reduce unwanted noise or light.', 'හැකි නම් විවේක ගන්නා ස්ථානය සුවපහසු කර අනවශ්‍ය ශබ්දය හෝ ආලෝකය අඩු කරන්න.', 'முடிந்தால் ஓய்விடத்தை வசதியாக்கி தேவையற்ற ஒலி அல்லது ஒளியைக் குறைக்கவும்.']],
      [['Get help for ongoing sleep problems', 'දිගුකාලීන නින්දේ ගැටලු සඳහා සහාය', 'தொடர்ந்த தூக்கப் பிரச்சினைக்கு உதவி பெறுங்கள்'], ['Talk with a health professional if sleep problems continue or affect your daily life.', 'නින්දේ ගැටලු දිගටම පවතී නම් හෝ දෛනික ජීවිතයට බලපායි නම් සෞඛ්‍ය වෘත්තිකයෙකු සමඟ කතා කරන්න.', 'தூக்கச் சிக்கல்கள் தொடர்ந்தாலோ அன்றாட வாழ்க்கையைப் பாதித்தாலோ சுகாதார நிபுணரிடம் பேசுங்கள்.']],
    ],
  },
  {
    id: 'kindness',
    names: ['Self-compassion', 'තමාට කරුණාව', 'சுய இரக்கம்'],
    intro: ['Being kind to yourself can coexist with taking responsibility and making changes.', 'තමාට කරුණාව දැක්වීම සහ වගකීම භාරගෙන වෙනස්වීම එකට කළ හැකිය.', 'உங்களிடம் கருணையாக இருப்பதும் பொறுப்பேற்று மாற்றம் செய்வதும் ஒன்றாக இருக்கலாம்.'],
    articles: [
      [['Speak as you would to a friend', 'මිතුරෙකුට මෙන් කතා කරන්න', 'நண்பரிடம் பேசுவது போலப் பேசுங்கள்'], ['Try a supportive phrase that is honest rather than harsh.', 'දැඩි වචන වෙනුවට අවංක සහ සහාය දෙන වාක්‍යයක් භාවිත කරන්න.', 'கடுமையான வார்த்தைகளுக்குப் பதில் உண்மையான ஆதரவான சொற்களைப் பயன்படுத்துங்கள்.']],
      [['Allow an imperfect day', 'අසම්පූර්ණ දවසක් පිළිගන්න', 'முழுமையற்ற நாளை ஏற்றுக்கொள்ளுங்கள்'], ['A difficult day does not erase the effort you have already made.', 'අසීරු දවසක් ඔබ දැනටමත් දැරූ උත්සාහය මකා නොදමයි.', 'கடினமான நாள் நீங்கள் ஏற்கனவே செய்த முயற்சியை அழித்துவிடாது.']],
      [['Notice harsh thoughts', 'දැඩි සිතුවිලි හඳුනාගන්න', 'கடுமையான எண்ணங்களைக் கவனியுங்கள்'], ['When a thought uses words like “always”, look for a more balanced description.', 'සිතුවිල්ලක “සැමවිටම” වැනි වචන ඇති විට වඩා සමබර විස්තරයක් සොයන්න.', 'ஒரு எண்ணத்தில் “எப்போதும்” போன்ற சொற்கள் வந்தால் சமநிலையான விளக்கத்தைத் தேடுங்கள்.']],
      [['Celebrate small efforts', 'කුඩා උත්සාහ අගය කරන්න', 'சிறிய முயற்சிகளைப் பாராட்டுங்கள்'], ['Notice a small effort you made today, even if the outcome was not what you hoped.', 'ප්‍රතිඵලය බලාපොරොත්තු වූ ලෙස නොවූවත් අද කළ කුඩා උත්සාහයක් හඳුනාගන්න.', 'முடிவு எதிர்பார்த்தபடி இல்லாவிட்டாலும் இன்று செய்த சிறிய முயற்சியைக் கவனியுங்கள்.']],
      [['Rest without guilt', 'වරදකාරී හැඟීමකින් තොරව විවේක ගන්න', 'குற்ற உணர்வின்றி ஓய்வெடுங்கள்'], ['Give yourself permission to pause and return when you are ready.', 'නැවත සූදානම් වන තුරු මඳක් නැවතීමට ඔබට අවසර දෙන්න.', 'சிறிது ஓய்வெடுத்து தயாரானபோது திரும்ப உங்களுக்கு அனுமதி கொடுங்கள்.']],
    ],
  },
  {
    id: 'connection',
    names: ['Connection', 'සබඳතා', 'உறவுகள்'],
    intro: ['Supportive connection can begin with a small, safe conversation.', 'සහාය දෙන සබඳතාවක් කුඩා, ආරක්ෂිත සංවාදයකින් ආරම්භ විය හැකිය.', 'ஆதரவான தொடர்பு ஒரு சிறிய பாதுகாப்பான உரையாடலில் தொடங்கலாம்.'],
    articles: [
      [['Reach out', 'සම්බන්ධ වන්න', 'தொடர்பு கொள்ளுங்கள்'], ['Send a simple message to someone you trust and say you would like to talk.', 'විශ්වාසවන්ත කෙනෙකුට සරල පණිවිඩයක් යවා කතා කිරීමට කැමති බව කියන්න.', 'நம்பகமான ஒருவருக்குச் சிறிய செய்தி அனுப்பி பேச விரும்புவதாகச் சொல்லுங்கள்.']],
      [['Listen with care', 'සැලකිල්ලෙන් සවන් දෙන්න', 'அக்கறையுடன் கேளுங்கள்'], ['Give the other person time to speak and ask what kind of support they want.', 'අනෙක් පුද්ගලයාට කතා කිරීමට කාලය දී ඔවුන්ට අවශ්‍ය සහාය කුමක්දැයි අසන්න.', 'மற்றவருக்குப் பேச நேரம் கொடுத்து அவர்களுக்கு என்ன உதவி வேண்டும் எனக் கேளுங்கள்.']],
      [['Share a specific need', 'නිශ්චිත අවශ්‍යතාවක් කියන්න', 'குறிப்பிட்ட தேவையைப் பகிருங்கள்'], ['You might ask for company, practical help, or simply a listening ear.', 'ඔබට එකට සිටීම, ප්‍රායෝගික උපකාරයක් හෝ සවන් දීමක් ඉල්ලා සිටිය හැකිය.', 'உடனிருப்பதையோ நடைமுறை உதவியையோ அல்லது கேட்பதையோ கேட்கலாம்.']],
      [['Plan a small connection', 'කුඩා හමුවක් සැලසුම් කරන්න', 'சிறு சந்திப்பைத் திட்டமிடுங்கள்'], ['A short walk, call, or shared meal can be a gentle way to reconnect.', 'කෙටි ඇවිදීමක්, ඇමතුමක් හෝ එකට ආහාර ගැනීමක් නැවත සම්බන්ධ වීමට උපකාරී විය හැකිය.', 'சிறிய நடை, அழைப்பு அல்லது ஒன்றாக உண்பது மீண்டும் தொடர்புகொள்ள உதவலாம்.']],
      [['Respect different experiences', 'වෙනස් අත්දැකීම්වලට ගරු කරන්න', 'வெவ்வேறு அனுபவங்களை மதியுங்கள்'], ['You can acknowledge another person’s feelings without having the same experience.', 'එකම අත්දැකීම නොතිබුණත් අනෙක් පුද්ගලයාගේ හැඟීම් පිළිගත හැකිය.', 'அதே அனுபவம் இல்லாவிட்டாலும் மற்றவரின் உணர்வுகளை ஏற்றுக்கொள்ளலாம்.']],
    ],
  },
  {
    id: 'boundaries',
    names: ['Healthy boundaries', 'සෞඛ්‍ය සම්පන්න සීමා', 'ஆரோக்கியமான எல்லைகள்'],
    intro: ['Boundaries help describe what you need and what you can reasonably offer.', 'ඔබට අවශ්‍ය දේ සහ සාධාරණව ලබා දිය හැකි දේ පැහැදිලි කිරීමට සීමා උපකාරී වේ.', 'உங்களுக்குத் தேவையானதையும் நீங்கள் அளிக்கக்கூடியதையும் விளக்க எல்லைகள் உதவுகின்றன.'],
    articles: [
      [['Pause before agreeing', 'එකඟ වීමට පෙර මඳක් නවතින්න', 'ஒப்புக்கொள்ளுமுன் சிந்தியுங்கள்'], ['It is okay to say you need time to check your capacity before answering.', 'පිළිතුරු දීමට පෙර ඔබට හැකිදැයි බැලීමට කාලය අවශ්‍ය බව කීම සුදුසුය.', 'பதிலளிக்குமுன் உங்களால் முடியுமா எனச் சிந்திக்க நேரம் கேட்பது சரியே.']],
      [['Use clear words', 'පැහැදිලි වචන භාවිත කරන්න', 'தெளிவாகப் பேசுங்கள்'], ['Describe your limit simply, such as “I cannot take this on today.”', '“මට අද මෙය භාරගත නොහැකියි” වැනි සරල වාක්‍යයකින් ඔබේ සීමාව කියන්න.', '“இதை இன்று என்னால் ஏற்க முடியாது” என்று உங்கள் எல்லையை எளிமையாகச் சொல்லுங்கள்.']],
      [['Notice your capacity', 'ඔබට කළ හැකි ප්‍රමාණය හඳුනාගන්න', 'உங்கள் திறனைக் கவனியுங்கள்'], ['Consider your energy and commitments before offering more help.', 'තවත් උපකාර කිරීමට පෙර ඔබේ ශක්තිය සහ වගකීම් ගැන සිතන්න.', 'மேலும் உதவ முன்வருமுன் உங்கள் ஆற்றலையும் பொறுப்புகளையும் கவனியுங்கள்.']],
      [['Protect quiet time', 'නිහඬ කාලය රැකගන්න', 'அமைதியான நேரத்தைப் பாதுகாக்கவும்'], ['Choose a small period for rest and communicate when you will be available again.', 'විවේකයට කෙටි කාලයක් තෝරා ඔබ නැවත ලබා ගත හැකි වේලාව දැනුම් දෙන්න.', 'ஓய்வுக்கு சிறிது நேரம் ஒதுக்கி மீண்டும் எப்போது பேசலாம் எனத் தெரிவியுங்கள்.']],
      [['Ask for support with boundaries', 'සීමා තබාගැනීමට සහාය ඉල්ලන්න', 'எல்லைகளை அமைக்க உதவி கேளுங்கள்'], ['If setting a boundary feels unsafe, speak with someone you trust about safer options.', 'සීමාවක් තැබීම ආරක්ෂිත නොවන බව දැනේ නම් ආරක්ෂිත විකල්ප ගැන විශ්වාසවන්ත කෙනෙකු සමඟ කතා කරන්න.', 'எல்லை அமைப்பது பாதுகாப்பற்றதாகத் தோன்றினால் பாதுகாப்பான வழிகள் பற்றி நம்பகமான ஒருவரிடம் பேசுங்கள்.']],
    ],
  },
  {
    id: 'movement',
    names: ['Gentle movement', 'මෘදු චලනය', 'மென்மையான இயக்கம்'],
    intro: ['Movement can be adapted to your body and circumstances; comfort matters.', 'චලනය ඔබේ ශරීරයට සහ තත්ත්වයට ගැළපෙන ලෙස වෙනස් කළ හැකිය; සුවපහසුව වැදගත්ය.', 'இயக்கத்தை உங்கள் உடலுக்கும் சூழலுக்கும் ஏற்ப மாற்றலாம்; வசதி முக்கியம்.'],
    articles: [
      [['Stretch gently', 'මෘදුව දිගු කරන්න', 'மெதுவாக நீட்டுங்கள்'], ['If comfortable, roll your shoulders or stretch your hands without forcing movement.', 'සුවපහසු නම් බල නොකර උරහිස් කරකවන්න හෝ අත් දිගු කරන්න.', 'வசதியாக இருந்தால் வற்புறுத்தாமல் தோள்களைச் சுழற்றவும் அல்லது கைகளை நீட்டவும்.']],
      [['Try a short walk', 'කෙටි ඇවිදීමක් උත්සාහ කරන්න', 'சிறிய நடை முயற்சிக்கவும்'], ['If accessible, a brief walk indoors or outdoors can provide a change of scene.', 'හැකි නම් ගෘහස්ථව හෝ පිටත කෙටි ඇවිදීමක් පරිසරය වෙනස් කරයි.', 'முடிந்தால் உள்ளேயோ வெளியேயோ சிறிய நடை சூழலை மாற்ற உதவும்.']],
      [['Move in your own way', 'ඔබට ගැළපෙන ලෙස චලනය වන්න', 'உங்களுக்கு ஏற்றபடி இயங்குங்கள்'], ['Seated movement, stretching, or dancing can all be adapted to your comfort.', 'වාඩි වී කරන චලනය, දිගු කිරීම හෝ නැටීම ඔබේ සුවපහසුවට ගැළපිය හැකිය.', 'அமர்ந்தபடி இயங்குதல், நீட்டுதல் அல்லது நடனம் உங்கள் வசதிக்கேற்ப மாற்றப்படலாம்.']],
      [['Notice when to pause', 'නැවතිය යුතු විට හඳුනාගන්න', 'நிறுத்த வேண்டிய நேரத்தைக் கவனியுங்கள்'], ['Stop or adjust if a movement causes pain or discomfort.', 'චලනයකින් වේදනාවක් හෝ අපහසුතාවක් ඇති වේ නම් නවත්වන්න හෝ වෙනස් කරන්න.', 'இயக்கம் வலி அல்லது அசௌகரியம் ஏற்படுத்தினால் நிறுத்தவும் அல்லது மாற்றவும்.']],
      [['Enjoy a change of scene', 'පරිසරයේ වෙනසක් විඳින්න', 'சூழல் மாற்றத்தை அனுபவியுங்கள்'], ['If possible, spend a few moments near a window, garden, or other pleasant space.', 'හැකි නම් ජනේලයක්, වත්තක් හෝ වෙනත් ප්‍රසන්න තැනක මොහොතක් ගත කරන්න.', 'முடிந்தால் ஜன்னல், தோட்டம் அல்லது இதமான இடத்தின் அருகில் சிறிது நேரம் செலவிடுங்கள்.']],
    ],
  },
  {
    id: 'mindfulness',
    names: ['Mindful moments', 'සිහියෙන් ගත කරන මොහොත', 'கவனமுள்ள தருணங்கள்'],
    intro: ['Mindfulness means noticing the present gently, not forcing your mind to be empty.', 'සිහිය යනු මනස හිස් කිරීමට බල කිරීම නොව වර්තමානය මෘදුව නිරීක්ෂණය කිරීමයි.', 'கவனமுடன் இருப்பது மனதை வெறுமையாக்க வற்புறுத்துவது அல்ல; நிகழ்காலத்தை மென்மையாகக் கவனிப்பது.'],
    articles: [
      [['Notice a sound', 'ශබ්දයක් නිරීක්ෂණය කරන්න', 'ஒரு ஒலியைக் கவனியுங்கள்'], ['Listen to a nearby sound for a moment and notice when it changes.', 'අසල ශබ්දයකට මොහොතක් සවන් දී එය වෙනස් වන විට හඳුනාගන්න.', 'அருகிலுள்ள ஓசையைச் சிறிது நேரம் கேட்டு அது மாறுவதைக் கவனியுங்கள்.']],
      [['Observe your surroundings', 'වටපිටාව නිරීක්ෂණය කරන්න', 'சுற்றுப்புறத்தைக் கவனியுங்கள்'], ['Look for a few colors or shapes around you without needing to judge them.', 'විනිශ්චය නොකර වටා ඇති වර්ණ හෝ හැඩ කිහිපයක් සොයන්න.', 'தீர்ப்பிடாமல் உங்களைச் சுற்றியுள்ள சில நிறங்களையோ வடிவங்களையோ பாருங்கள்.']],
      [['Return gently', 'මෘදුව නැවත අවධානය යොමු කරන්න', 'மெதுவாகக் கவனத்தைத் திருப்புங்கள்'], ['When your mind wanders, notice it and return to what you chose to observe.', 'මනස ඉවතට යන විට එය හඳුනාගෙන තෝරාගත් දෙයට නැවත අවධානය යොමු කරන්න.', 'மனம் அலைந்தால் அதைக் கவனித்து தேர்ந்தெடுத்த பொருளுக்கு மெதுவாகத் திரும்புங்கள்.']],
      [['Mindful everyday tasks', 'දෛනික කටයුතු සිහියෙන් කරන්න', 'அன்றாடச் செயல்களை கவனத்துடன் செய்யுங்கள்'], ['While drinking water or washing your hands, notice the sensations for a few seconds.', 'ජලය පානය කරන විට හෝ අත් සෝදන විට තත්පර කිහිපයක් සංවේදනා නිරීක්ෂණය කරන්න.', 'தண்ணீர் குடிக்கும்போதோ கைகளை கழுவும்போதோ சில நொடிகள் உணர்வுகளைக் கவனியுங்கள்.']],
      [['Choose a comfortable practice', 'සුවපහසු පුහුණුවක් තෝරන්න', 'வசதியான பயிற்சியைத் தேர்வுசெய்க'], ['If focusing inward feels difficult, notice the room or stop and try another activity.', 'ඇතුළත අවධානය අපහසු නම් කාමරය නිරීක්ෂණය කරන්න හෝ නවතා වෙනත් ක්‍රියාවක් කරන්න.', 'உள்நோக்கிக் கவனிப்பது கடினமாக இருந்தால் அறையைக் கவனிக்கவும் அல்லது நிறுத்தி வேறு செயலை முயற்சிக்கவும்.']],
    ],
  },
  {
    id: 'support',
    names: ['Finding support', 'සහාය සොයාගැනීම', 'ஆதரவைக் கண்டறிதல்'],
    intro: ['Seeking support is a valid step, whether a concern is new or has lasted a while.', 'ගැටලුවක් අලුත් වුවත් දිගු කලක් පැවතුණත් සහාය සෙවීම සුදුසු පියවරකි.', 'பிரச்சினை புதியதாக இருந்தாலும் நீண்ட காலமாக இருந்தாலும் உதவி தேடுவது சரியான படியாகும்.'],
    articles: [
      [['Talk to someone you trust', 'විශ්වාසවන්ත කෙනෙකු සමඟ කතා කරන්න', 'நம்பகமான ஒருவரிடம் பேசுங்கள்'], ['Choose a person who listens respectfully and tell them what you are experiencing.', 'ගෞරවයෙන් සවන් දෙන කෙනෙකු තෝරා ඔබ අත්විඳින දේ ඔවුන්ට කියන්න.', 'மரியாதையுடன் கேட்கும் ஒருவரைத் தேர்ந்தெடுத்து உங்கள் அனுபவத்தைச் சொல்லுங்கள்.']],
      [['Prepare for an appointment', 'හමුවකට සූදානම් වන්න', 'சந்திப்புக்குத் தயாராகுங்கள்'], ['Write down your concerns and questions before meeting a health professional.', 'සෞඛ්‍ය වෘත්තිකයෙකු හමුවීමට පෙර ඔබේ ගැටලු සහ ප්‍රශ්න ලියාගන්න.', 'சுகாதார நிபுணரைச் சந்திக்குமுன் உங்கள் கவலைகளையும் கேள்விகளையும் எழுதுங்கள்.']],
      [['Explore available services', 'ලබාගත හැකි සේවා සොයන්න', 'கிடைக்கும் சேவைகளை ஆராயுங்கள்'], ['Check the support directory and confirm current contact details with the provider.', 'සහාය නාමාවලිය බලන්න; වත්මන් සම්බන්ධතා විස්තර සේවා සපයන්නා සමඟ තහවුරු කරන්න.', 'ஆதரவு பட்டியலைப் பார்த்து தற்போதைய தொடர்பு விவரங்களைச் சேவை வழங்குநரிடம் உறுதிப்படுத்துங்கள்.']],
      [['Ask about access', 'ප්‍රවේශය ගැන විමසන්න', 'அணுகல் பற்றிக் கேளுங்கள்'], ['Ask a provider about languages, costs, accessibility, and appointment options.', 'භාෂා, ගාස්තු, ප්‍රවේශ පහසුකම් සහ හමුවීම් ගැන සේවා සපයන්නෙකුගෙන් විමසන්න.', 'மொழிகள், கட்டணம், அணுகல் வசதிகள் மற்றும் சந்திப்பு வாய்ப்புகள் பற்றி கேளுங்கள்.']],
      [['Know when to seek urgent help', 'හදිසි උපකාර අවශ්‍ය විට හඳුනාගන්න', 'அவசர உதவி தேவைப்படும் நேரத்தை அறியுங்கள்'], ['If you or someone else is in immediate danger, contact local emergency services or go to the nearest hospital.', 'ඔබ හෝ වෙනත් අයෙකු ක්ෂණික අනතුරක නම් ප්‍රාදේශීය හදිසි සේවා අමතන්න හෝ ළඟම රෝහලට යන්න.', 'உங்களுக்கோ வேறொருவருக்கோ உடனடி ஆபத்து இருந்தால் உள்ளூர் அவசர சேவையை அழைக்கவும் அல்லது அருகிலுள்ள மருத்துவமனைக்குச் செல்லவும்.']],
    ],
  },
];

function parseReadResources(value) {
  const parsed = value ? JSON.parse(value) : [];
  if (!Array.isArray(parsed) || parsed.some(id => typeof id !== 'string')) {
    throw new Error('Saved reading progress has an unexpected format.');
  }
  return parsed;
}

module.exports = { languages, topics, parseReadResources };
