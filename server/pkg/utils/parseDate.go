package utils

import (
	"fmt"
	"time"
)

func ParseDueDate(dueDateString string) (time.Time, error) {
	formats := []string{
		"2006-01-02T15:04:05.000Z", // Full ISO 8601 with milliseconds
		"2006-01-02T15:04:05Z",     // ISO 8601 without milliseconds
		"2006-01-02",               // Date-only format
		"2006-01-02T15:04:05",      // Date and time without UTC suffix
		"2006-01-02T15:04:05.999",  // Date and time with milliseconds
		"2006-01-02 15:04:05",      // Space-separated date and time
	}

	for _, format := range formats {
		parsedDate, err := time.Parse(format, dueDateString)
		if err == nil {
			return parsedDate, nil
		}
	}
	return time.Time{}, fmt.Errorf("invalid dueDate format")
}
