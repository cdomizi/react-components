import { useCallback, useState } from "react";

import getRandomData from "../../utils/getRandomData";
import { Post } from "./Post";
import { Logger } from "../../components/Logger";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";

export type PostType = {
  id: number;
  title: string;
  body: string;
};

const posts = [
  {
    body: "Things aren't going well at all with mom today. She is just a limp noodle and wants to.",
    id: 30,
    title: "Things aren't going well at all",
  },
  {
    body: "The chair sat in the corner where it had been for over 25 years. The only difference was.",
    id: 29,
    title: "The chair sat in the corner where it had been",
  },
  {
    body: "He had three simple rules by which he lived. The first was to never eat blue food. There.",
    id: 28,
    title: "He had three simple rules by which he lived.",
  },
  {
    body: "If he could take ten more steps it would be over, but his legs wouldn't move. He tried.",
    id: 27,
    title: "Ten more steps.",
  },
  {
    body: "She patiently waited for his number to be called. She had no desire to be there, but her.",
    id: 26,
    title: "She patiently waited for his number to be called.",
  },
  {
    body: "It went through such rapid contortions that the little bear was forced to change his hold on it.",
    id: 25,
    title: "It went through such rapid contortions",
  },
  {
    body: "The robot clicked disapprovingly, gurgled briefly inside its cubical interior and extruded a pony glass of brownish liquid..",
    id: 24,
    title: "The robot clicked disapprovingly.",
  },
  {
    body: "It's an unfortunate reality that we don't teach people how to make money (beyond getting a 9 to.",
    id: 23,
    title:
      "It's an unfortunate reality that we don't teach people how to make money",
  },
  {
    body: "She has seen this scene before. It had come to her in dreams many times before. She had.",
    id: 22,
    title: "She has seen this scene before.",
  },
  {
    body: "He wandered down the stairs and into the basement. The damp, musty smell of unuse hung in the.",
    id: 21,
    title: "He wandered down the stairs and into the basement",
  },
  {
    body: "He couldn't remember exactly where he had read it, but he was sure that he had. The fact.",
    id: 20,
    title: "He couldn't remember exactly where he had read it",
  },
  {
    body: "The rain and wind abruptly stopped, but the sky still had the gray swirls of storms in the.",
    id: 19,
    title: "The rain and wind abruptly stopped.",
  },
  {
    body: "She had a terrible habit o comparing her life to others. She realized that their life experiences were.",
    id: 18,
    title: "She had a terrible habit o comparing her life to others",
  },
  {
    body: "She was in a hurry. Not the standard hurry when you're in a rush to get someplace, but.",
    id: 17,
    title: "She was in a hurry.",
  },
  {
    body: "There was only one way to do things in the Statton house. That one way was to do.",
    id: 16,
    title: "There was only one way to do things in the Statton house.",
  },
  {
    body: "The trees, therefore, must be such old and primitive techniques that they thought nothing of them, deeming them.",
    id: 15,
    title: "The trees, therefore, must be such old",
  },
  {
    body: "The paper was blank. It shouldn't have been. There should have been writing on the paper, at least.",
    id: 14,
    title: "The paper was blank.",
  },
  {
    body: "She wanted rainbow hair. That's what she told the hairdresser. It should be deep rainbow colors, too. She.",
    id: 13,
    title: "She wanted rainbow hair.",
  },
  {
    body: "She was aware that things could go wrong. In fact, she had trained her entire life in anticipation.",
    id: 12,
    title: "She was aware that things could go wrong.",
  },
  {
    body: "It wasn't quite yet time to panic. There was still time to salvage the situation. At least that.",
    id: 11,
    title: "It wasn't quite yet time to panic.",
  },
  {
    body: "They rushed out the door, grabbing anything and everything they could think of they might need. There was.",
    id: 10,
    title: "They rushed out the door.",
  },
  {
    body: "There are different types of secrets. She had held onto plenty of them during her life, but this.",
    id: 9,
    title: "There are different types of secrets.",
  },
  {
    body: "One can cook on and with an open fire. These are some of the ways to cook with.",
    id: 8,
    title: "One can cook on and with an open fire.",
  },
  {
    body: "This is important to remember. Love isn't like pie. You don't need to divide it among all your.",
    id: 7,
    title: "This is important to remember.",
  },
  {
    body: "Dave wasn't exactly sure how he had ended up in this predicament. He ran through all the events.",
    id: 6,
    title: "Dave wasn't exactly sure how he had ended up",
  },
  {
    body: "Hopes and dreams were dashed that day. It should have been expected, but it still came as a.",
    id: 5,
    title: "Hopes and dreams were dashed that day.",
  },
  {
    body: "All he wanted was a candy bar. It didn't seem like a difficult request to comprehend, but the.",
    id: 4,
    title: "All he wanted was a candy bar.",
  },
  {
    body: "Dave watched as the forest burned up on the hill, only a few miles from her house. The.",
    id: 3,
    title: "Dave watched as the forest burned up on the hill.",
  },
  {
    body: "He was an expert but not in a discipline that anyone could fully appreciate. He knew how to.",
    id: 2,
    title: "He was an expert but not in a discipline",
  },
  {
    body: "His mother had always taught him not to ever think of himself as better than others. He'd tried.",
    id: 1,
    title: "His mother had always taught him",
  },
];

const Posts = () => {
  const [randomPost, setRandomPost] = useState<PostType | null>(null);
  const getRandomPost = useCallback(async () => {
    const { title, body } = await getRandomData<PostType>(
      "https://dummyjson.com/posts",
    );
    const formatBody = body.split(" ").slice(0, 18).join(" ") + ".";
    const randomPost = { id: posts.length + 1, title, body: formatBody };

    setRandomPost(randomPost);
  }, []);

  return (
    <Box m={3}>
      <Typography variant="h2" mb={6}>
        Posts
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => void getRandomPost()}
      >
        Get random post
      </Button>
      <Logger value={randomPost} />
      <Divider />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={5}
        justifyContent="center"
        useFlexGap
        mt={4}
        sx={{ flexWrap: { xs: "nowrap", sm: "wrap" } }}
      >
        {posts.length
          ? posts.map((post) => <Post key={post.id} post={post} />)
          : "No posts yet."}
      </Stack>
    </Box>
  );
};

export default Posts;
