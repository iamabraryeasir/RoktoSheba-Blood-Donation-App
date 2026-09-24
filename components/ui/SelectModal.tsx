import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface SelectModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
}

export const SelectModal: React.FC<SelectModalProps> = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  placeholder = "Search...",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((item) => item.toLowerCase().includes(q));
  }, [options, searchQuery]);

  const handleSelect = (item: string) => {
    onSelect(item);
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <SafeAreaView className="bg-surface rounded-t-3xl max-h-[80%] flex-1">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-border">
            <Text className="font-inter-bold text-h3 text-text-primary">
              {title}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              className="p-1 -mr-1"
            >
              <Feather name="x" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View className="px-5 py-3">
            <View className="flex-row items-center bg-background border border-border rounded-xl px-3 h-11">
              <Feather name="search" size={18} color="#9CA3AF" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                className="flex-1 font-inter text-body text-text-primary ml-2 py-0"
                autoCorrect={false}
              />
              {searchQuery ? (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="p-1"
                >
                  <Feather name="x-circle" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Options List */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item === selectedValue;
              return (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => handleSelect(item)}
                  className={`flex-row items-center justify-between py-3.5 px-3 border-b border-border ${
                    isSelected ? "bg-primary-surface rounded-lg" : ""
                  }`}
                >
                  <Text
                    className={`font-inter text-body ${
                      isSelected
                        ? "font-inter-semibold text-primary"
                        : "text-text-primary"
                    }`}
                  >
                    {item}
                  </Text>
                  {isSelected ? (
                    <Feather name="check" size={18} color="#DC2626" />
                  ) : null}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View className="items-center justify-center py-10">
                <Text className="font-inter text-body text-text-tertiary">
                  No matching options found
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};
