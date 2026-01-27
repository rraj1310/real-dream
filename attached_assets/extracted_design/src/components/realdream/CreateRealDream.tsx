import { useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "../common/AppHeader";
import { BottomNav } from "../common/BottomNav";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Check, Square } from "lucide-react";

export function CreateRealDream() {
  const navigate = useNavigate();
  
  const [checklist, setChecklist] = useState([
    { id: 1, text: "1. Name Your RealDream....", completed: false },
    { id: 2, text: "2. RealDream Timeline....", completed: false },
    { id: 3, text: "3. RealDream Design....", completed: false },
    { id: 4, text: "4. RealDream Image....", completed: false },
    { id: 5, text: "5. RealDream Routine....", completed: false },
    { id: 6, text: "6. Privacy (Public or Connections....", completed: false },
  ]);

  const toggleCheckItem = (id: number) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleSubmit = () => {
    const allCompleted = checklist.every(item => item.completed);
    if (!allCompleted) {
      alert("Please complete all steps before creating your RealDream");
      return;
    }
    alert("✅ RealDream created successfully!");
    navigate("/my-realdream");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <AppHeader title="CREATE PERSONAL REALDREAM" showBack />

      <div className="p-4 space-y-4">
        {/* Checklist Card */}
        <Card>
          <div className="p-6 space-y-4">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheckItem(item.id)}
                className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {item.text}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-colors ${
                  item.completed
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                }`}>
                  {item.completed ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Square className="w-5 h-5 text-transparent" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Advertisement Placeholder */}
        <div className="bg-blue-400 dark:bg-blue-600 rounded-lg p-6 text-center">
          <p className="text-white font-semibold text-lg">ADVERTISEMENT</p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="w-full"
        >
          Create RealDream
        </Button>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-4">
          Complete all steps to create your RealDream. Each step helps you define and track your goals effectively.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}