package boundary;

import dtos.CreateVideoDTO;
import dtos.EditVideoDTO;
import dtos.VideoDetailDTO;
import dtos.VideoOverviewDTO;
import enums.VisibilityEnum;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import model.AnswerOption;
import model.Video;
import org.jboss.resteasy.reactive.RestResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repository.VideoFileRepository;
import repository.VideoRepository;

import java.io.File;
import java.util.List;

@Path("video")
public class VideoResource {
    private static final Logger log = LoggerFactory.getLogger(VideoResource.class);
    @Inject
    VideoRepository videoRepository;

    @Inject
    VideoFileRepository videoFileRepository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVideo(@QueryParam("userId") Long userId, CreateVideoDTO createVideoDTO){
        try {
            Video video = videoRepository.create(createVideoDTO, userId);

            return Response.ok(video).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Path("{videoId: [0-9]+}")
    public Response getVideoDetails(@PathParam("videoId") Long videoId, @QueryParam("userId") Long userId){
        VideoDetailDTO videoDetailDTO;
        try{
            videoDetailDTO = videoRepository.getVideoDetailsForUser(videoId, userId);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videoDetailDTO).build();
    }

    @GET
    public Response getAllAsOverviewDTO(){
        List<VideoOverviewDTO> videoOverviewDTOs;
        try{
            videoOverviewDTOs = videoRepository.getAllAsOverviewDTO();
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videoOverviewDTOs).build();
    }

/*    @GET
    @Path("{id: [0-9]+}")
    public Response getVideo(@PathParam("id") Long id){
        Video video;
        try{
            video = videoRepository.getById(id);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(video).build();
    }*/

    @GET
    @Produces(MediaType.MULTIPART_FORM_DATA)
    @Path("{videoId:[0-9]+}/videofile/{fileName}")
    public RestResponse<File> getVideoFragment(@PathParam("fileName") String fileName, @PathParam("videoId") Long videoId) {
        try {
            File file = videoFileRepository.getVideoFragment(videoId, fileName);
            return RestResponse.ResponseBuilder.ok(file)
                    .header("Content-Disposition", "attachment; filename=\""+ fileName +"\"")
                    .build();
        }
        catch (NullPointerException e){
            //return RestResponse.ResponseBuilder.notFound().build();
            return null;
        }
        catch (Exception e){
            e.printStackTrace();
            //return RestResponse.ResponseBuilder.serverError().build();
            return null;
        }
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteVideo(@PathParam("id") Long id){
        try{
            videoRepository.delete(id);
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateVideo(EditVideoDTO video, @QueryParam("userId") Long userId){
        try{
            VideoDetailDTO videoDetailDTO = videoRepository.update(video, userId);

            return Response.ok(videoDetailDTO).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @PUT
    @Path("{videoId: [0-9]+}/visibility")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateVisibility(@PathParam("videoId") Long videoId, @QueryParam("userId") Long userId, JsonObject v){
        try{
            videoRepository.updateVideoVisibility(videoId, userId, VisibilityEnum.valueOf(v.getString("visibility")));
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{videoId: [0-9]+}/linkVideoFile/{fileId: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response linkVideoFile(@PathParam("videoId") Long videoId, @PathParam("fileId") Long fileId){
        try{
            videoRepository.linkVideoFile(videoId, fileId);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @POST
    @Path("{videoId: [0-9]+}/finishquiz/{score: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response finishQuiz(@PathParam("videoId") Long videoId, @QueryParam("userId") Long userId, @PathParam("score") int quiz, List<AnswerOption> selectedAnswers){
        try{
            videoRepository.finishQuiz(videoId, userId, quiz, selectedAnswers);
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Path("{videoId: [0-9]+}/quizresults")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getQuizResults(@PathParam("videoId") Long videoId, @QueryParam("userId") Long userId){
        try{
            return Response.ok(videoRepository.getQuizResults(videoId, userId)).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }
}
