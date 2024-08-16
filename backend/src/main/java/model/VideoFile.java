package model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Entity
public class VideoFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long videoFileId;
    private Long durationSeconds;
    private long sizeBytes = -1;
    private String originalFileExtension;
    private String originalFileName;

    LocalDateTime timestamp;

    public VideoFile(String fileName) {
        this();
        String[] splitName = fileName.split("\\.");
        this.originalFileExtension = splitName[splitName.length - 1];
        this.originalFileName = fileName;
    }

    public VideoFile(long sizeBytes, String originalFileExtension, Long durationSeconds) {
        this();
        this.sizeBytes = sizeBytes;
        this.originalFileExtension = originalFileExtension;
        this.durationSeconds = durationSeconds;
    }

    public VideoFile() {
        timestamp = LocalDateTime.now();
    }

    public Long getVideoFileId() {
        return videoFileId;
    }

    public Long getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Long durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    public void setSizeBytes(long sizeBytes) {
        this.sizeBytes = sizeBytes;
    }

    public String getOriginalFileExtension() {
        return originalFileExtension;
    }

    public void setOriginalFileExtension(String originalFileExtension) {
        this.originalFileExtension = originalFileExtension;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
