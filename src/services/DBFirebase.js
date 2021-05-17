import firebase from 'firebase/app';
import firebaseApp from '../utils/FirebaseApp';

const database = firebaseApp.database();
const getMessagesRef = (groupId) => database.ref(`messages/${groupId}/content`);
const geUsersRef = (userId, groupId = null) => {
  if (groupId) return database.ref(`users/${userId}/notification/${groupId}`);
  else return database.ref(`users/${userId}/notification`);
};

export const messageTypes = {
  TEXT: 'TEXT',
  FILE: 'FILE'
};

export const addMessage = async (groupId, messageObject, roomInfo) => {
  const timestamp = firebase.database.ServerValue.TIMESTAMP;
  const messagesRef = getMessagesRef(groupId);
  const key = messagesRef.push().key;
  await messagesRef.update({
    [key]: {
      id: key,
      timestamp,
      ...messageObject,
    }
  });

  const {host, tenant, name} = roomInfo;
  const senderId = Number(messageObject.from.uid);
  const receiver = senderId === Number(host.id) ? tenant : host;

  [host, tenant].forEach(async (value, index) => {
    const isOwner = senderId === Number(value.id);
    const content = messageObject.type === 'TEXT' ? messageObject.content : 'Đã gửi 1 tệp';

    await geUsersRef(value.id, groupId).update({
      receiver,
      id: groupId,
      title: name,
      type: 'message',
      read: isOwner,
      timestamp,
      description: {
        type: messageObject.type,
        content: `${isOwner ? 'Bạn: ' : value.id === Number(host.id) ? `${tenant.displayName}: ` : 'Chủ trọ: '}${content}`
      },
    });
  });
};

export const makeMessage = (type, content, user) => {
  if (!content) return null; // if message is an empty string
  if (!/\S/.test(content)) return null; // if message contains only whitespaces
  return {
    type,
    content,
    from: user
  }
};

export const onMessagesDataChange = (groupId, handler) => {
  const visibleMessagesRef = getMessagesRef(groupId).orderByChild('timestamp').limitToLast(100);
  return visibleMessagesRef.on('value', snapshot => {
    const messages = [];
    snapshot.forEach(messageSnapshot => {
      messages.push(messageSnapshot.val())
    });
    handler(messages)
  })
};

export const getNoticeMessages = (uid, handle) => {
  const ref = geUsersRef(uid).orderByChild('timestamp');
  ref.on('value', snapshot => {
    let arrData = [];
    snapshot.forEach(value => {
      arrData.push({
        ...value.toJSON(),
        key: value.key
      })
    });

    const output = arrData.sort((x, y) => (x.timestamp - y.timestamp));
    handle(output);
  });
};

export const offMessagesDataChange = (groupId, onFunction) => getMessagesRef(groupId).off('value', onFunction);
export const offNoticeListen = (userId, onFunction) => geUsersRef(userId).off('value', onFunction);
export const readNotification = (userId, groupId) => geUsersRef(userId, groupId).update({read: true});
