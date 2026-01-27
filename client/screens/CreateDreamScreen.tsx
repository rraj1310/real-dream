import { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, TextInput, ScrollView, ActivityIndicator, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import { ThemedText } from "@/components/ThemedText";
import { GalaxyBackground } from "@/components/GalaxyBackground";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

type DreamTypeOption = "personal" | "challenge" | "group";

interface TaskItem {
  id: string;
  title: string;
  dueDate: Date | null;
}

export default function CreateDreamScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { theme } = useTheme();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState<DreamTypeOption>(route.params?.type || "personal");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [targetDate, setTargetDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | null>(null);
  const [showTaskDatePicker, setShowTaskDatePicker] = useState(false);

  useEffect(() => {
    if (route.params?.type) {
      setSelectedType(route.params.type);
    }
  }, [route.params?.type]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const onStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onTargetDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTargetPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  };

  const onTaskDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTaskDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewTaskDueDate(selectedDate);
    }
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      dueDate: newTaskDueDate,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDueDate(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Please enter a title for your dream");
      return;
    }
    if (!token) return;

    setIsLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await fetch(new URL('/api/dreams', getApiUrl()).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          type: selectedType,
          startDate: startDate.toISOString(),
          targetDate: targetDate.toISOString(),
        }),
      });

      if (response.ok) {
        const dream = await response.json();
        
        for (const task of tasks) {
          await fetch(new URL(`/api/dreams/${dream.id}/tasks`, getApiUrl()).toString(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: task.title,
              dueDate: task.dueDate?.toISOString() || null,
              order: tasks.indexOf(task),
            }),
          });
        }
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.navigate("DreamDetail", { dreamId: dream.id });
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create dream");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GalaxyBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.springify()}>
          <ThemedText type="h2" style={styles.title}>Create Your Dream</ThemedText>
          <ThemedText type="body" style={styles.subtitle}>
            Set a goal and start your journey
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <ThemedText type="small" style={styles.label}>
            DREAM TITLE
          </ThemedText>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Learn to play guitar"
            placeholderTextColor="#8B7FC7"
            testID="input-dream-title"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <ThemedText type="small" style={styles.label}>
            DESCRIPTION (OPTIONAL)
          </ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your dream in detail..."
            placeholderTextColor="#8B7FC7"
            multiline
            numberOfLines={4}
            testID="input-dream-description"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ThemedText type="small" style={styles.label}>
            TIMELINE
          </ThemedText>
          <View style={styles.dateRow}>
            <Pressable 
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
              testID="button-start-date"
            >
              <Feather name="calendar" size={18} color="#A78BFA" />
              <View>
                <ThemedText type="small" style={styles.dateLabel}>Start Date</ThemedText>
                <ThemedText style={styles.dateValue}>{formatDate(startDate)}</ThemedText>
              </View>
            </Pressable>
            <Pressable 
              style={styles.dateButton}
              onPress={() => setShowTargetPicker(true)}
              testID="button-target-date"
            >
              <Feather name="flag" size={18} color="#22C55E" />
              <View>
                <ThemedText type="small" style={styles.dateLabel}>Target Date</ThemedText>
                <ThemedText style={styles.dateValue}>{formatDate(targetDate)}</ThemedText>
              </View>
            </Pressable>
          </View>
        </Animated.View>

        {showStartPicker ? (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onStartDateChange}
            minimumDate={new Date()}
          />
        ) : null}

        {showTargetPicker ? (
          <DateTimePicker
            value={targetDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTargetDateChange}
            minimumDate={startDate}
          />
        ) : null}

        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <ThemedText type="small" style={styles.label}>
            MILESTONES / TASKS
          </ThemedText>
          <ThemedText type="small" style={styles.helperText}>
            Add tasks to track your progress (optional)
          </ThemedText>
          
          <View style={styles.addTaskContainer}>
            <TextInput
              style={[styles.input, styles.taskInput]}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Add a milestone..."
              placeholderTextColor="#8B7FC7"
              testID="input-new-task"
            />
            <Pressable 
              style={styles.taskDateButton}
              onPress={() => setShowTaskDatePicker(true)}
            >
              <Feather 
                name="calendar" 
                size={18} 
                color={newTaskDueDate ? "#22C55E" : "#8B7FC7"} 
              />
            </Pressable>
            <Pressable 
              style={styles.addTaskButton}
              onPress={addTask}
              testID="button-add-task"
            >
              <Feather name="plus" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {newTaskDueDate ? (
            <ThemedText type="small" style={styles.selectedDateText}>
              Due: {formatDate(newTaskDueDate)}
            </ThemedText>
          ) : null}

          {showTaskDatePicker ? (
            <DateTimePicker
              value={newTaskDueDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTaskDateChange}
              minimumDate={startDate}
              maximumDate={targetDate}
            />
          ) : null}

          {tasks.length > 0 ? (
            <View style={styles.tasksList}>
              {tasks.map((task, index) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={styles.taskNumber}>
                    <ThemedText style={styles.taskNumberText}>{index + 1}</ThemedText>
                  </View>
                  <View style={styles.taskInfo}>
                    <ThemedText style={styles.taskTitle}>{task.title}</ThemedText>
                    {task.dueDate ? (
                      <ThemedText type="small" style={styles.taskDueDate}>
                        Due: {formatDate(task.dueDate)}
                      </ThemedText>
                    ) : null}
                  </View>
                  <Pressable 
                    onPress={() => removeTask(task.id)}
                    style={styles.removeTaskButton}
                  >
                    <Feather name="x" size={16} color="#EF4444" />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}
        </Animated.View>

        {error ? (
          <ThemedText type="small" style={styles.errorText}>{error}</ThemedText>
        ) : null}

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <View style={styles.progressInfo}>
            <Feather name="info" size={16} color="#A78BFA" />
            <ThemedText type="small" style={styles.progressInfoText}>
              Your progress will be calculated based on completed tasks
            </ThemedText>
          </View>
          
          <Button
            onPress={handleCreate}
            disabled={isLoading}
            style={styles.createButton}
            testID="button-submit-dream"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Feather name="star" size={20} color="#FFFFFF" />
                <ThemedText style={styles.buttonText}>Start My Dream</ThemedText>
              </View>
            )}
          </Button>
        </Animated.View>
      </ScrollView>
    </GalaxyBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.xs,
    color: "#FFFFFF",
  },
  subtitle: {
    textAlign: "center",
    color: "#C4B5FD",
  },
  label: {
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    color: "#C4B5FD",
  },
  helperText: {
    color: "#8B7FC7",
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    fontSize: 16,
    backgroundColor: "rgba(45, 39, 82, 0.6)",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(139, 127, 199, 0.3)",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  dateRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(45, 39, 82, 0.6)",
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(139, 127, 199, 0.3)",
  },
  dateLabel: {
    color: "#8B7FC7",
    fontSize: 10,
  },
  dateValue: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  addTaskContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  taskInput: {
    flex: 1,
  },
  taskDateButton: {
    backgroundColor: "rgba(45, 39, 82, 0.6)",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: "rgba(139, 127, 199, 0.3)",
  },
  addTaskButton: {
    backgroundColor: "#8B5CF6",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  selectedDateText: {
    color: "#22C55E",
    marginTop: Spacing.xs,
  },
  tasksList: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(45, 39, 82, 0.4)",
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(139, 127, 199, 0.2)",
  },
  taskNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  taskNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  taskDueDate: {
    color: "#8B7FC7",
    fontSize: 11,
    marginTop: 2,
  },
  removeTaskButton: {
    padding: Spacing.xs,
  },
  progressInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  progressInfoText: {
    color: "#C4B5FD",
    flex: 1,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
  createButton: {
    marginTop: Spacing.sm,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
