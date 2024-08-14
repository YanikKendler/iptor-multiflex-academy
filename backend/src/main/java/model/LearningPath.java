package model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
public class LearningPath {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    Long pathId;

    @OneToMany
    private
    List<LearningPathEntry> entries;

    private String title;

    private String description;

    private final LocalDateTime creationTime;

    public LearningPath(String title, String description) {
        this();
        this.entries = new LinkedList<>();
        this.title = title;
        this.description = description;
    }

    public LearningPath() {
        creationTime = LocalDateTime.now();
    }

    public List<LearningPathEntry> addEntry(LearningPathEntry entry) {
        entries.add(entry);
        return entries;
    }

    public List<LearningPathEntry> removeEntry(LearningPathEntry entry) {
        entries.remove(entry);
        return entries;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreationTime() {
        return creationTime;
    }
}
