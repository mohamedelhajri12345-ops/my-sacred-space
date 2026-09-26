import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { quran } from '../src/content';
import { colors } from '../src/theme';

export default function Quran() {
  const [query,setQuery]=useState('');
  const items=useMemo(()=>Array.isArray(quran)?quran:quran?.data ?? [],[quran]);
  const filtered=query.trim()?items.filter((x:any)=>JSON.stringify(x).includes(query.trim())):items;
  return <SafeAreaView style={s.safe}>
    <Text style={s.title}>القرآن الكريم</Text>
    <TextInput value={query} onChangeText={setQuery} placeholder="ابحث في القرآن..." placeholderTextColor={colors.muted} style={s.input}/>
    <FlatList data={filtered} keyExtractor={(x:any,i)=>String(x.id??x.number??i)} renderItem={({item})=><View style={s.card}><Text style={s.ar}>{item.text??item.ayah??item.name??JSON.stringify(item)}</Text></View>} initialNumToRender={12}/>
  </SafeAreaView>
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.cream,padding:16},title:{fontSize:28,fontWeight:'800',color:colors.navy,textAlign:'right',marginBottom:14},input:{backgroundColor:'#fff',borderRadius:16,padding:14,textAlign:'right',borderWidth:1,borderColor:colors.border,marginBottom:12},card:{backgroundColor:'#fff',borderRadius:18,padding:18,marginBottom:10},ar:{fontSize:22,lineHeight:40,color:colors.ink,textAlign:'right'}})
