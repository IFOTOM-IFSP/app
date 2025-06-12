import BackButton from "@/components/ui/BackButton";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function QuizScreen() {
  const { id } = useLocalSearchParams();

 
  type QuizKey = "1" | "2" | "3";
  type Quiz = {
    title: string;
    questions: {
      question: string;
      options: string[];
      answer: number;
    }[];
  };
  const quizData: Record<QuizKey, Quiz> = {
    "1": {
      title: "Quiz Básico",
      questions: [
        {
          question: "Qual é a capital do Brasil?",
          options: ["Rio de Janeiro", "Brasília", "São Paulo"],
          answer: 1
        }
      ]
    },
    "2": {
      title: "Quiz Intermediário",
      questions: [
        {
          question: "Quantos estados tem o Brasil?",
          options: ["26", "27", "28"],
          answer: 1
        }
      ]
    },
    "3": {
      title: "Quiz Avançado",
      questions: [
        {
          question: "Qual oceano banha o Brasil?",
          options: ["Pacífico", "Atlântico", "Índico"],
          answer: 1
        }
      ]
    }
  };

  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);

  const quiz = quizData[id as QuizKey];
  const question = quiz.questions[currentQuestion];

  const handleAnswer = (selectedOption: number) => {
    if (selectedOption === question.answer) {
      setScore(score + 1);
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Quiz completo! Pontuação: ${score}/${quiz.questions.length}`);
    }
  };

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton style={styles.backButton} />
        <Text style={styles.title}>{quiz.title}</Text>
      </View>


      
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        
        {question.options.map((option: string, index: number) => (
          <Pressable
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      
      <Text style={styles.progress}>
        Questão {currentQuestion + 1}/{quiz.questions.length}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      marginTop: 32,
    },
    backButton: {
      marginRight: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: Colors.light.accentPurple,
    },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  progress: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
  },
});