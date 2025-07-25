import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import Loader from "../Loader";
import service from "../../appwrite/database";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {addPost,updatePost} from "../../store/postSlice.js"
import ChoronoDropAD from "../Ads/ChronoDropPromotion.jsx";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",

        },
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    const [loading, setLoading] = useState(false); 

    const submit = async (data) => {
        setLoading(true); 

        try {
            if (post) {
                const file = data.image[0] ? await service.uploadFile(data.image[0]) : null;
                if (file) {
                    service.deleteFile(post.featuredImg);
                }

                const dbPost = await service.updatePost(post.$id, {
                    ...data,
                    featuredImg: file ? file.$id : undefined,
                });

                if (dbPost) {
                    dispatch(updatePost({ ...dbPost, id: post.$id }))
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                const file = await service.uploadFile(data.image[0]);

                if (file) {
                    const fileId = file.$id;
                    data.featuredImg = fileId;
                    //console.log(userData.name)
                    const dbPost = await service.createPost({ ...data, userId: userData.$id,userName: userData.name });

                    if (dbPost) {
                        dispatch(addPost(dbPost));
                        navigate(`/post/${dbPost.$id}`);
                    } 
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
        } finally {
            setLoading(false);
        }
    };


    // const slugTransform = useCallback((value) => {
    //     if (value && typeof value === "string")
    //         return value
    //             .trim()
    //             .toLowerCase()
    //             .replace(/[^a-zA-Z\d\s]+/g, "-")
    //             .replace(/\s/g, "-");

    //     return "";
    // }, []);

    // useEffect(() => {
    //     const subscription = watch((value, { name }) => {
    //         if (name === "title") {
    //             setValue("slug", slugTransform(value.title), { shouldValidate: true });
    //         }
    //     });

    //     return () => subscription.unsubscribe();
    // }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title:"
                    placeholder="Title"
                    className="mb-4 text-white"
                    {...register("title", { required: true })}
                />
                {/* <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                /> */}
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4 text-white"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featuredImg)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" loading={loading}>
                    {loading ? (
                        <Loader /> 
                    ) : (
                        post ? "Update" : "Submit"
                    )}
                </Button>
                <div className="mt-4">
                </div>
            </div>
            <ChoronoDropAD/>
        </form>
    );
}

