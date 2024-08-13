package dtos;

import model.Tag;
import model.VideoFile;

import java.util.List;

public record VideoOverviewDTO(Long videoId, String title, String description, List<Tag> tags, String color, Long durationSeconds) {
    public VideoOverviewDTO(Long videoId, String title, String description, List<Tag> tags, String color, Long durationSeconds) {
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.color = color;
        this.durationSeconds = durationSeconds;
    }
}
