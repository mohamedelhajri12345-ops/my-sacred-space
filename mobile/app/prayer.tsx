import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../src/theme';
export default function Prayer(){return <View style={s.root}><Text style={s.title}>مواقيت الصلاة</Text><Text style={s.note}>تم تجهيز هذه الشاشة لتوصيل حسابات Adhan والموقع الجغرافي الأصلية من المشروع.</Text></View>}
const s=StyleSheet.create({root:{flex:1,backgroundColor:colors.cream,padding:24,justifyContent:'center'},title:{fontSize:30,fontWeight:'800',color:colors.navy,textAlign:'right'},note:{fontSize:18,lineHeight:30,color:colors.ink,textAlign:'right',marginTop:14}})
