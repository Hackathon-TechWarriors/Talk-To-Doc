from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.text_splitter import CharacterTextSplitter
from langchain import OpenAI, VectorDBQA
from langchain.document_loaders import PyPDFLoader
from langchain.document_loaders import DirectoryLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import AzureOpenAI
import openai
import os
 
OPENAI_API_TYPE = 'AZURE'
OPENAI_API_BASE = 'https://testsairam.openai.azure.com/'
OPENAI_API_KEY = '5d9e5b9b3ea74c129d10e0daac868450'
OPENAI_API_VERSION = '2023-05-15'
DeploymentName = 'TestEmbedding2'
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())
os.environ['OPENAI_API_KEY'] = OPENAI_API_KEY
os.environ['OPENAI_API_BASE'] = OPENAI_API_BASE
os.environ['OPENAI_API_VERSION'] = OPENAI_API_VERSION
os.environ['DeploymentId'] = 'SampleDeployment'
openai.api_type = "azure"
openai.api_base = "https://testsairam.openai.azure.com/"
openai.api_version = "2023-05-15"
openai.api_key = '0d62103b8312467f89de522b58678565'
 
openai.Embedding.create(engine="TestEmbedding", data="Your input text here", input= 'Yes', model = 'text-embedding-ada-002')    
embedding = OpenAIEmbeddings(openai_api_key = OPENAI_API_KEY,model='text-embedding-ada-002', engine='TestEmbedding')
persist_directory = 'docs/chroma/'
 
def save_file(filename):
    return "File Saved"
 
def create_vectors(Filename):
    loader = PyPDFLoader(Filename)
    pages = loader.load()
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=150,
        length_function=len
    )
    docs = text_splitter.split_documents(pages)
    i=0
    while i < len(docs):
        vectordb=Chroma.from_documents(docs[i:i+15], embedding=embedding)
        i=i+16
        print(i)
    return vectordb  
 
 
def Summarize_File(Filename,socketio):
    vectordb = create_vectors(Filename)
    print("VectorDB Created")
    question =  "Summarize categories of Olympics legacies"    
    docs_ss = vectordb.similarity_search(question)
    vectordb=Chroma.from_documents(docs_ss, embedding=embedding, persist_directory = persist_directory)
    chain=  RetrievalQA.from_chain_type(llm=OpenAI(engine='TalktoDocModel'), chain_type="stuff", retriever=vectordb.as_retriever())
    summary = chain.run("Summarize categories of Olympics legacies")
    socketio.emit('SummarizeResponse', {'data':summary})
    return chain
 
 
 
     
def start_conversation(question,emit):
    emit("ConversationResponse",{'data':"Conversation Started!"})
    vectordb = create_vectors("Files/IOC_Olympic_Games_Framework.pdf")
    docs_ss = vectordb.similarity_search(question)
    vectordb=Chroma.from_documents(docs_ss, embedding=embedding, persist_directory = persist_directory)
    chain=  RetrievalQA.from_chain_type(llm=OpenAI(engine='TalktoDocModel'), chain_type="stuff", retriever=vectordb.as_retriever())
    answer = chain.run(question)
    emit('ConversationResponse', {'data':answer})
    return answer
   
# qa = Summarize_File("Files/IOC_Olympic_Games_Framework.pdf")
# ans=qa.run("Summarize categories of Olympics legacies")
# print(ans)    