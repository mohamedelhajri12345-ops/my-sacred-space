import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../src/theme';
export default function Tasbih(){const [count,setCount]=useState(0);const add=async()=>{setCount(c=>c+1);await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)};return <View style={s.root}><Text style={s.title}>المسبحة</Text><Text style={s.count}>{count}</Text><Pressable onPress={add} style={s.button}><Text style={s.bt}>سبّح</Text></Pressable><Pressable onPress={()=>setCount(0)}><Text style={s.reset}>إعادة العداد</Text></Pressable></View>}
const s=StyleSheet.create({root:{flex:1,backgroundColor:colors.navy,alignItems:'center',justifyContent:'center',padding:24},title:{color:'#DCC78A',fontSize:30,fontWeight:'800',marginBottom:30},count:{color:'#fff',fontSize:80,fontWeight:'900'},button:{marginTop:30,width:220,height:220,borderRadius:110,backgroundColor:colors.teal,alignItems:'center',justifyContent:'center'},bt:{color:'#fff',fontSize:28,fontWeight:'800'},reset:{color:'#CFE7EA',marginTop:25,fontSize:16}})
