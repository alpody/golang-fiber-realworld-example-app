package logger

import "fmt"

type MockLogger struct{}

func (m *MockLogger) Debug(message interface{}, args ...interface{}) {
	fmt.Printf("DEBUG: %v\n", message)
}

func (m *MockLogger) Info(message string, args ...interface{}) {
	fmt.Printf("INFO: %s\n", message)
}

func (m *MockLogger) Warn(message string, args ...interface{}) {
	fmt.Printf("WARN: %s\n", message)
}

func (m *MockLogger) Error(message interface{}, args ...interface{}) {
	fmt.Printf("ERROR: %v\n", message)
}

func (m *MockLogger) Fatal(message interface{}, args ...interface{}) {
	fmt.Printf("FATAL: %v\n", message)
}
