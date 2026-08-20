export default function handler(req, res) {
  res.status(200).json({
    message: 'SkillSwap API connected successfully',
    skills: [
      { name: 'React', category: 'Frontend' },
      { name: 'Node.js', category: 'Backend' },
      { name: 'Python', category: 'Automation' },
      { name: 'UI/UX', category: 'Design' },
      { name: 'Java', category: 'Enterprise' },
      { name: 'Data Analysis', category: 'Analytics' }
    ]
  });
}
