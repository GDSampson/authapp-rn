import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Fab from '@/components/fab/fab'
import { useQuery } from '@tanstack/react-query'
import { fetchMessages } from '@/utils/api'
import { ErrorState } from '@/components/common/ErrorState'
import { COLORS } from '@/utils/colors'
import { EmptyState } from '@/components/common/EmptyState'
import MessageItem from '@/components/messages/MessageItem'

const Page = () => {
  const { data: messages, isLoading, isError, isPending, refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: () => fetchMessages(),
  })

  if (isError) {
    return <ErrorState message='Failed to fetch messages' onRetry={refetch} />
  }

  return (
    <View style={styles.container}>
      {isPending ? (
        <ActivityIndicator size={'large'} color={COLORS.primary} />
      ) : (
        <FlatList
        ListEmptyComponent={<>{!isLoading && <EmptyState message='No messages yet'/>}</>}
          data={messages?.data}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch}/>}
          renderItem={({ item }) => <MessageItem message={item}/>} 
          contentContainerStyle={styles.list}
        />
          
      )}
      <Fab />
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  }
})