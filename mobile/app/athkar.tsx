import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { athkar } from '../src/content';
import { colors } from '../src/theme';

export default function Athkar() {
 const items=Array.isArray(athkar)?athkar:athkar?.athkar??athkar?.morning??[];
 return <SafeAreaView style={s.safe}><Text style={s.title}>الأذكار والأدعية</Text><ScrollView>{items.slice(0,80).map((x:any,i)=><View key={i} style={s.card}><Text style={s.text}>{x.text??x.content??x.title??String(x)}</Text></View>)}</ScrollView></SafeAreaView>
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.cream,padding:16},title:{fontSize:28,fontWeight:'800',color:colors.navy,textAlign:'right',marginBottom:14},card:{backgroundColor:'#fff',borderRadius:18,padding:18,marginBottom:10},text:{fontSize:19,lineHeight:34,color:colors.ink,textAlign:'right'}})
