from flask import Flask, jsonify

app = Flask(__name__)

# Replace these values with your Supabase URL and Key
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

from supabase import create_client, Client


@app.route('/update_user_data', methods=['GET'])
def update_user_data():
    users_response = supabase.table('user').select("*").execute()
    users = users_response.data

    #gets every message of every user 
    for i in range(len(users)):
        user_id = users[i]['id']

        messages_response = supabase.table('message').select("*").eq('user_id', user_id).execute()
        messages = messages_response.data

        total_likes = sum(message['likes'] for message in messages)
        total_dislikes = sum(message['dislikes'] for message in messages)

        user_update_data = {'total_likes': total_likes, 'total_dislikes': total_dislikes}
        supabase.table('user').update(user_update_data).eq('id', user_id).execute()

        trendy_messages_count = 0

        for message in messages:
            if message['views'] > 10 and (message['likes'] - message['dislikes']) > 3:
                trendy_update_data = {'is_trendy': True}
                supabase.table('message').update(trendy_update_data).eq('id', message['id']).execute()
                trendy_messages_count += 1

        user_update_data = {'trendy_posts': trendy_messages_count}
        supabase.table('user').update(user_update_data).eq('id', user_id).execute()
    
    # will check each uer and update if they are trendy
    for i in range(len(users)):
        user_id = users[i]['id']
        tips = users[i]['tips']
        likes = users[i]['total_likes']
        dislikes = users[i]['total_dislikes']
        subscribers = users[i]['subscribers']
        trendy_message_amount = users[i]['trendy_posts']

        if subscribers > 10 and (tips > 100 or likes - dislikes > 10) and trendy_message_amount >= 2:
            update_data = {'is_popular': True, 'user_type':'trendy'}
            supabase.table('user').update(update_data).eq('id', user_id).execute()


    return jsonify({"message": "User data updated successfully"})

@app.route('/taboo_words', methods=['GET'])
def taboo_words():
    taboo_words_response = supabase.table('taboo_word').select("*").execute()
    word_data = taboo_words_response.data
    taboo_words = []
    
    
    for i in range(len(word_data)):
        word = word_data[i]['word']
        taboo_words.append(word)

    messages_response = supabase.table('message').select("*").eq('message_type', 'message').execute()
    messages = messages_response.data
    print(messages)

    for i in range(len(messages)):
        message_content = messages[i]['message_content']
        message_id = messages[i]['id']
        for taboo_word in taboo_words:
        # Replace each occurrence of the taboo word with asterisks
            replacement = '*' * len(taboo_word)
            if taboo_word in message_content:
                updated_message = message_content.replace(taboo_word, replacement)      
                message_update = {'message_content': updated_message}
                supabase.table('message').update(message_update).eq('id', message_id).execute()

    return jsonify({"message": "Taboo Words Success"})

@app.route('/subscriber_update',  methods=['GET'])
def sub_update():
    users_response = supabase.table('user').select("*").execute()
    users = users_response.data

    #gets every message of every user 
    for i in range(len(users)):
        user_id = users[i]['id']

        subscriber_response = supabase.table('subscribers').select("*").eq('follow_id', user_id).execute()
        subscribers = subscriber_response.data
        subscriber_list = []
        for j in range(len(subscribers)):
            subscriber_list.append(subscribers[j]['user_id'])

        subscriber_count = len(subscriber_list)
        print(subscriber_count, subscriber_list)
        user_sub_data = {'subscribers': subscriber_count}
        supabase.table('user').update(user_sub_data).eq('id',user_id).execute()

    return jsonify({"message": "Subscriber Count Success"})


if __name__ == '__main__':
    app.run(debug=True)





# if there is time : add functionality to support two taboo words and if there are two taboo words then delete and add to warning count