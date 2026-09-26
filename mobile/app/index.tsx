import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../src/theme';

const actions = [
  ['القرآن الكريم', '/quran'],
  ['الأذكار', '/athkar'],
  ['المسبحة', '/tasbih'],
  ['الصلاة', '/prayer']
] as const;

export default function Home() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
          <Text style={styles.title}>مساحتك المقدسة</Text>
          <Text style={styles.subtitle}>رفيقك اليومي للقرآن والذكر والصلاة</Text>
        </View>
        <Text style={styles.section}>الوصول السريع</Text>
        <View style={styles.grid}>
          {actions.map(([label, route]) => (
            <Pressable key={route} onPress={() => router.push(route)} style={({pressed}) => [styles.card, pressed && styles.pressed]}>
              <Text style={styles.cardIcon}>{label === 'القرآن الكريم' ? '۞' : label === 'الأذكار' ? 'ﷲ' : label === 'المسبحة' ? '●' : '🕌'}</Text>
              <Text style={styles.cardText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:colors.cream},
 content:{padding:spacing.md,paddingBottom:40},
 hero:{backgroundColor:colors.navy,borderRadius:28,padding:28,marginBottom:24},
 bismillah:{color:'#DCC78A',fontSize:18,textAlign:'center',marginBottom:18},
 title:{color:colors.white,fontSize:30,fontWeight:'800',textAlign:'center'},
 subtitle:{color:'#CFE7EA',fontSize:15,textAlign:'center',marginTop:8},
 section:{fontSize:21,fontWeight:'800',color:colors.ink,marginBottom:12,textAlign:'right'},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:12,justifyContent:'space-between'},
 card:{width:'48%',minHeight:130,borderRadius:22,backgroundColor:colors.white,borderWidth:1,borderColor:colors.border,padding:18,justifyContent:'space-between'},
 pressed:{opacity:.7,transform:[{scale:.98}]},
 cardIcon:{fontSize:30,color:colors.teal},
 cardText:{fontSize:17,fontWeight:'700',color:colors.ink,textAlign:'right'}
});
