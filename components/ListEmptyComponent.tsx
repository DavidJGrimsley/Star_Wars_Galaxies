import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface ListEmptyComponentProps {
    loading: boolean
    message?: string
}

const ListEmptyComponent = ({loading, message = 'No items found'}: ListEmptyComponentProps) => {
  return (
    <View style={styles.emptyContainer}>
      <Text>ListEmptyComponent</Text>
    </View>
  )
}

export default ListEmptyComponent

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})