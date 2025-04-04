import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Fab from '@/components/fab/fab'
import { useQuery } from '@tanstack/react-query'
import { fetchMessages } from '@/utils/api'
import { ErrorState } from '@/components/common/ErrorState'
import { COLORS } from '@/utils/colors'

const Page = () => {
  const {data: messages, isLoading, isError,isPending, refetch} = useQuery({
    queryKey: ['messages'],
    queryFn: () => fetchMessages(),
  })

  if (isError) {
    return <ErrorState message='Failed to fetch messages' onRetry={refetch}/>
  }

  return (
    <View style={styles.container}>
      {isPending ? (
        <ActivityIndicator size={'large'} color={COLORS.primary}/>
      ) : (
        <FlatList data={messages?.data} renderItem={({item}) => <Text>{item.content}</Text>}/>
      )}
      <Fab/>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})