import { Alert, Linking } from 'react-native';

export default async function openContact(contact) {
  const url = contact.type === 'phone'
    ? `tel:${contact.value.replace(/[^\d+]/g, '')}`
    : contact.value;
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Unable to open contact', 'This device cannot open the selected phone or web link.');
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert(
      'Unable to open contact',
      error.message || 'Please try again or use the contact details shown in the listing.',
    );
  }
}
