import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Header from '../Components/Header';
import MainView from '../Components/MainView';

const TextToImageSetting = ({ route }) => {
  const [isAdvanced, setIsAdvanced] = React.useState(false);
  const [selectedRatio, setSelectedRatio] = React.useState('16:9');
  const { onSelectAspectRatio } = route.params;

  const handleSelectAspectRatio = (selectedRatio) => {
    setSelectedRatio(selectedRatio);
    onSelectAspectRatio(selectedRatio);
  };

  const ratios = ['1:1', '4:3', '3:4', '16:9', '9:16'];
  return (
    <MainView>
      <Header Title="Settings" IsBack />

      {/* Aspect Ratio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aspect Ratio</Text>
        <FlatList
          data={ratios}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectAspectRatio(item)}
              style={[styles.ratioButton, item === selectedRatio && { backgroundColor: '#0099FF' }]}>
              <Text style={[styles.ratioText, item === selectedRatio && { color: '#fff' }]}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      {/* Negative Prompt Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Negative Prompt</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Don't include..."
            placeholderTextColor="#888"
          />

        </View>
      </View>
    </MainView>
  );
};

export default TextToImageSetting;

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    padding: 20
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  ratioButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  ratioText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ED7EFF',
    backgroundColor: '#000',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: '35%',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    color: '#00f',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
