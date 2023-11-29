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
import random
from langchain.chains.llm import LLMChain
from langchain.prompts import PromptTemplate
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate


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
vectordbGlobal =  None

def create_vectors(Filename,socketio):
    loader = PyPDFLoader(Filename)
    global vectordbGlobal 
    pages = loader.load()
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=150,
        length_function=len
    )
    socketio.emit("upload_progress",{"data":"50"})
    docs = text_splitter.split_documents(pages)
    i=0
    while i < len(docs):
        vectordbGlobal = Chroma.from_documents(docs[i:i+15], embedding=embedding,persist_directory=persist_directory)
        i=i+16
    return vectordbGlobal  


def Summarize_File(Filename,socketio):
    summary=[]
    socketio.emit("upload_progress",{"data":"40"})
    create_vectors(Filename,socketio)
    socketio.emit("upload_progress",{"data":"60"})
    prompt_template = """Write a concise summary of the following:"{text}"CONCISE SUMMARY:"""
    socketio.emit("upload_progress",{"data":"70"})
    loader = PyPDFLoader(Filename)
    docs = loader.load()
    socketio.emit("upload_progress",{"data":"80"})
    prompt = PromptTemplate.from_template(prompt_template)
    llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo-16k", engine ='TalktoDocModel')
    llm_chain = LLMChain(llm=llm, prompt=prompt)
    stuff_chain = StuffDocumentsChain(llm_chain=llm_chain, document_variable_name="text")
    socketio.emit("upload_progress",{"data":"90"})
    i=0
    while i < len(docs):
        summary.insert(i,stuff_chain.run(docs[i:i+18]))     
        i=i+18
    #chain=  RetrievalQA.from_chain_type(llm=OpenAI(engine='TalktoDocModel'), chain_type="stuff", retriever=vectordb.as_retriever())
    #summary = chain.run("Summarize categories of Olympics legacies")
    socketio.emit("upload_progress",{"data":"100"})
    socketio.emit('SummarizeResponse', {'data':summary})
    return summary



     
def start_conversation(question,socketio,filename,emit):
        # GREETING_INPUTS = ["hi", "hello", "how are you","good morning"]#Greeting responses back to the user
        # GREETING_RESPONSES=["Hi,How can I help you"]#Function to return a random greeting response to a users greeting
        # if question.lower() in GREETING_INPUTS:
        #     return socketio.emit('ConversationResponse', {'data':random.choice(GREETING_RESPONSES) }) 
        
        
        vectordb = vectordbGlobal

        template ="""As an AI assistant you provide answers based on the given context, ensuring accuracy and brifness.
        
                You always follow these guidelines:
        
                -If the answer isn't available within the context, state that fact
                -Otherwise, answer to your best capability, refering to source of documents provided
                -Only use examples if explicitly requested
                {context}
                -Do not introduce examples outside of the context
                -Do not answer if context is absent
                -Limit responses to three or four sentences for clarity and conciseness"""
        QA_CHAIN_PROMPT = PromptTemplate(input_variables=['context'], template=template)
        # Memory
        from langchain.memory import ConversationBufferMemory
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        
        docs_ss = vectordb.similarity_search(question)
        #print(docs_ss)
        #vectordb=Chroma.from_documents(docs_ss, embedding=embedding, persist_directory = persist_directory)
        
        chain=  RetrievalQA.from_chain_type(llm=OpenAI(engine='TalktoDocModel'), chain_type="stuff", retriever=vectordb.as_retriever()
                                            #,chain_type_kwargs={"prompt": QA_CHAIN_PROMPT}
                                            ) # Need to provide correct models
        
        s=chain.run(question)
        print(s)
        g=s.split("\n")[0]
        print("g",g)
        result=chain({"query": question})
        #print(result)
        test=result['result'].split("Context")[0]
        test2=test.split("Context")[0]
        socketio.emit('ConversationResponse', {'data':g})
        print(test2)