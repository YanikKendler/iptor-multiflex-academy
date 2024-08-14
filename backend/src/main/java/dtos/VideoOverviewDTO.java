package dtos;

import model.Tag;
import model.ViewProgress;
import model.VideoFile;

import java.util.List;

public record VideoOverviewDTO(Long videoId, String title, String description, List<Tag> tags, String color, Long durationSeconds) {
}
